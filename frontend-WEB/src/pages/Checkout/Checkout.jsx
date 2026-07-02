import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAppStore from '../../store/useAppStore';
import useHaptic from '../../hooks/useHaptic';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { getStoredUser } from '../../services/firebase';
import './Checkout.css';

// ─── Environment & Configuration ───
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

const UI_STATES = {
  READY: 'READY_TO_PAY',
  PROCESSING: 'PROCESSING_PAYMENT',
  WAITING: 'WAITING_BACKEND_CONFIRMATION',
  SUCCESS: 'PAYMENT_SUCCESS',
  FAILED: 'PAYMENT_FAILED',
};

// ─── Checkout Form Component ───
const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lightTap, heavyTap, successTap, errorTap, mediumTap } = useHaptic();
  
  const { cart, getCartTotal, clearCart } = useAppStore();
  
  const storedUser = getStoredUser();
  const deliveryAddress = storedUser?.address || '452 West 19th Street, Apt 4B\nChelsea, New York, NY 10011';

  const [uiState, setUiState] = useState(UI_STATES.READY);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Payment Method Selection (Only capturing mode now)
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'cod'
  
  // Calculated Totals
  const subtotal = location.state?.computedSubtotal ?? getCartTotal();
  const deliveryFee = 0; // FREE
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoadingWallet, setIsLoadingWallet] = useState(
    location.state?.computedWalletApplied !== undefined ? false : true
  );

  useEffect(() => {
    // If we received pre-computed wallet amounts from Cart, skip polling
    if (location.state?.computedWalletApplied !== undefined) {
      return;
    }

    const fetchWalletBalance = async () => {
      try {
        if (!isMockMode && storedUser?.firebaseIdToken) {
          const response = await axios.get(
            `${API_BASE_URL}/services/apexrest/wallet/balance?token=${encodeURIComponent(storedUser.firebaseIdToken)}`
          );
          if (response.data && response.data.success) {
            setWalletBalance(response.data.availableBalance || 0);
          }
        } else {
          const walletTxns = JSON.parse(localStorage.getItem('quickplate_wallet_txns') || '[]');
          setWalletBalance(walletTxns.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0));
        }
      } catch (err) {
        console.error('Wallet balance fetch failed', err);
      } finally {
        setIsLoadingWallet(false);
      }
    };
    fetchWalletBalance();
    
    const interval = setInterval(fetchWalletBalance, 5000);
    return () => clearInterval(interval);
  }, [location.state?.computedWalletApplied]);
  
  // Max we can apply is the subtotal + deliveryFee + taxes (calculated without wallet first)
  const taxesPreWallet = location.state?.computedTaxes ?? (subtotal > 0 ? 4.50 : 0);
  const maxApplicableWallet = Math.min(walletBalance, subtotal + deliveryFee + taxesPreWallet);
  
  const useWallet = location.state?.useWallet !== false; // default true if missing
  const walletApplied = location.state?.computedWalletApplied ?? (useWallet ? maxApplicableWallet : 0);

  const taxes = taxesPreWallet;
  const totalPayStr = location.state?.computedTotalPay !== undefined 
    ? location.state.computedTotalPay.toFixed(2) 
    : Math.max(0, subtotal > 0 ? subtotal + deliveryFee + taxes - walletApplied : 0).toFixed(2);
  const totalPayCents = Math.round(parseFloat(totalPayStr) * 100);

  const pollingTimerRef = useRef(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const startBackendPolling = async (orderId) => {
    setUiState(UI_STATES.WAITING);
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      attempts++;
      try {
        let isPaid = false;
        
        if (isMockMode) {
          await new Promise(r => setTimeout(r, 2000));
          isPaid = true;
        } else {
          const response = await axios.get(`${API_BASE_URL}/services/apexrest/order/status/${orderId}`);
          if (response.data && ['PAID', 'PLACED', 'ASSIGNED', 'CONFIRMED'].includes(response.data.orderStatus)) {
            isPaid = true;
          }
        }

        if (isPaid) {
          clearInterval(pollingTimerRef.current);
          successTap();

          setUiState(UI_STATES.SUCCESS);
          
          setTimeout(() => {
            clearCart();
            navigate(`/tracking/${orderId}`, { replace: true });
          }, 2000);
        } else if (attempts >= maxAttempts) {
          throw new Error('Verification timeout. Please contact support.');
        }
      } catch (err) {
        clearInterval(pollingTimerRef.current);
        errorTap();
        setErrorMessage(err.message || 'Error communicating with backend.');
        setUiState(UI_STATES.FAILED);
        isSubmittingRef.current = false;
      }
    };

    pollingTimerRef.current = setInterval(poll, 3000);
    poll();
  };

  const handlePaySubmit = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    heavyTap();
    setUiState(UI_STATES.PROCESSING);
    setErrorMessage('');

    try {
      const orderId = location.state?.orderId;
      
      if (!orderId) {
        throw new Error('Order tracking ID is missing. Please initiate from the cart.');
      }

      // Deduct Wallet Balance Immediately upon purchase logic trigger
      if (walletApplied > 0) {
        const txns = JSON.parse(localStorage.getItem('quickplate_wallet_txns') || '[]');
        // ensure we don't deduct twice for same order
        const alreadyDeducted = txns.some(t => t.description === 'Payment for order ' + orderId);
        if (!alreadyDeducted) {
          txns.unshift({
             id: 'WTX-' + Math.floor(100000 + Math.random() * 900000),
             amount: -walletApplied,
             date: new Date().toISOString(),
             type: 'Order Deduct',
             description: 'Payment for order ' + orderId
          });
          localStorage.setItem('quickplate_wallet_txns', JSON.stringify(txns));
          window.dispatchEvent(new Event('storage')); // Alert other listeners
        }
      }

      if (totalPayCents === 0) {
        // Wallet covers everything, bypass external payment gateway
        if (isMockMode) {
          await new Promise(r => setTimeout(r, 1000));
        }
        startBackendPolling(orderId);
      } else if (paymentMethod === 'card') {
        const response = await axios.post(
          `${API_BASE_URL}/services/apexrest/checkout/create-session`,
          { orderId },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Session failed.');
        }

        window.location.href = response.data.checkoutUrl;
      } else {
        // Unified Generic Payment Submission for other methods (mock)
        if (isMockMode) {
          await new Promise(r => setTimeout(r, 1500));
        } else {
          await axios.post(`${API_BASE_URL}/create-payment-intent`, {
             orderId, amount: totalPayCents, method: paymentMethod
          }).catch(() => {});
        }
        
        startBackendPolling(orderId);
      }
    } catch (err) {
      isSubmittingRef.current = false;
      errorTap();
      setErrorMessage(err.message || 'An unexpected error occurred processing your order.');
      setUiState(UI_STATES.FAILED);
    }
  };

  return (
    <div className="checkout-content">
      {/* ─── State Modals ─── */}
      <AnimatePresence mode="wait">
        {(uiState === UI_STATES.WAITING || uiState === UI_STATES.SUCCESS || uiState === UI_STATES.FAILED || isLoadingWallet) && (
          <motion.div 
            className="checkout-state-overlay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key="state-overlay"
          >
            {isLoadingWallet && uiState !== UI_STATES.SUCCESS && uiState !== UI_STATES.FAILED && uiState !== UI_STATES.WAITING && (
              <>
                <div className="spinner dark state-icon-large pulsing" style={{ borderTopColor: 'var(--color-primary)', width: '60px', height: '60px' }} />
                <h3 className="checkout-state-title">Loading Security Layer...</h3>
                <p className="checkout-state-desc">Fetching encrypted details.</p>
              </>
            )}

            {uiState === UI_STATES.WAITING && !isLoadingWallet && (
              <>
                <div className="spinner dark state-icon-large pulsing" style={{ borderTopColor: 'var(--color-primary)', width: '60px', height: '60px' }} />
                <h3 className="checkout-state-title">Confirming your order...</h3>
                <p className="checkout-state-desc">Please don't close this screen while we verify the order securely.</p>
              </>
            )}
            
            {uiState === UI_STATES.SUCCESS && (
              <>
                <motion.span 
                  className="material-symbols-outlined state-icon-large success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                >
                  task_alt
                </motion.span>
                <h3 className="checkout-state-title">Order Confirmed!</h3>
                <p className="checkout-state-desc">Your order has been sent to the kitchen. Redirecting...</p>
              </>
            )}

            {uiState === UI_STATES.FAILED && (
              <>
                <span className="material-symbols-outlined state-icon-large error">error</span>
                <h3 className="checkout-state-title">Transaction Failed</h3>
                <p className="checkout-state-desc">{errorMessage}</p>
                <button 
                  className="retry-btn" 
                  onClick={() => { lightTap(); isSubmittingRef.current = false; setUiState(UI_STATES.READY); setErrorMessage(''); }}
                >
                  Retry Payment
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(uiState === UI_STATES.READY || uiState === UI_STATES.PROCESSING) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            key="checkout-flow"
          >
            {/* ─── Section: Delivering To ─── */}
            <div className="co-section">
              <h2 className="co-section-title">Delivering To</h2>
              <div className="co-address-card">
                <div className="co-address-icon">
                  <span className="material-symbols-outlined">home</span>
                </div>
                <div className="co-address-details">
                  <div className="co-address-header">
                    <h3 className="co-address-title">Residence</h3>
                    <button className="co-edit-btn" onClick={lightTap}>Edit</button>
                  </div>
                  <p className="co-address-text">{deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* ─── Section: Amount To Pay ─── */}
            <div className="co-section">
              <div className="co-pay-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="co-pay-left">
                    <div className="amount-label">Amount to Pay</div>
                    <div className="amount-value">${totalPayStr}</div>
                  </div>
                  <div className="co-pay-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>receipt_long</span>
                  </div>
                </div>
                
                {walletApplied > 0 && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px dashed #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4a5568' }}>
                      <span>Subtotal & Taxes</span>
                      <span>${(subtotal + deliveryFee + taxesPreWallet).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#00B894', fontWeight: '500' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>account_balance_wallet</span>
                        Wallet Applied
                      </span>
                      <span>- ${walletApplied.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Section: Payment Method ─── */}
            {totalPayCents > 0 ? (
              <div className="co-section">
                <h2 className="co-section-title">Payment Method</h2>

                {/* Card Option */}
                <div 
                  className={`co-method-row ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => { mediumTap(); setPaymentMethod('card'); }}
                >
                  <div className="co-method-icon">
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                  <div className="co-method-info">
                    <h4 className="co-method-title">Credit / Debit Card</h4>
                    <p className="co-method-sub">Visa, Mastercard, Amex</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <span className="material-symbols-outlined co-check-icon">check_circle</span>
                  )}
                </div>

                {/* UPI Option */}
                <div 
                  className={`co-method-row ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => { mediumTap(); setPaymentMethod('upi'); setErrorMessage(''); }}
                >
                  <div className="co-method-icon">
                    <span className="material-symbols-outlined">qr_code_scanner</span>
                  </div>
                  <div className="co-method-info">
                    <h4 className="co-method-title">UPI / QR Scanner</h4>
                    <p className="co-method-sub">Instant app-to-app payment</p>
                  </div>
                  {paymentMethod === 'upi' && (
                    <span className="material-symbols-outlined co-check-icon">check_circle</span>
                  )}
                </div>

                {/* COD Option */}
                <div 
                  className={`co-method-row ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => { mediumTap(); setPaymentMethod('cod'); setErrorMessage(''); }}
                >
                  <div className="co-method-icon">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="co-method-info">
                    <h4 className="co-method-title">Cash on Delivery</h4>
                    <p className="co-method-sub">Pay when your food arrives</p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <span className="material-symbols-outlined co-check-icon">check_circle</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="co-section">
                <div className="co-method-row selected" style={{ pointerEvents: 'none' }}>
                  <div className="co-method-icon" style={{ background: '#e6ffe6', color: '#00B894' }}>
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                  <div className="co-method-info">
                    <h4 className="co-method-title" style={{ color: '#00B894' }}>Paid by Wallet</h4>
                    <p className="co-method-sub">Your wallet balance covers the full amount</p>
                  </div>
                  <span className="material-symbols-outlined co-check-icon" style={{ color: '#00B894' }}>check_circle</span>
                </div>
              </div>
            )}

            {/* ─── Trust Badges ─── */}
            <div className="co-trust">
              <div className="co-trust-title">
                <span className="material-symbols-outlined">verified_user</span>
                <span>Secure Encrypted Checkout</span>
              </div>
              <div className="co-trust-badges">
                <div className="co-badge-cube"><span className="material-symbols-outlined">credit_score</span></div>
                <div className="co-badge-cube"><span className="material-symbols-outlined">lock</span></div>
                <div className="co-badge-cube"><span className="material-symbols-outlined">security</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Fixed Bottom Pay Button ─── */}
      <AnimatePresence>
        {(uiState === UI_STATES.READY || uiState === UI_STATES.PROCESSING) && (
          <motion.div 
            className="checkout-fixed-bottom"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
          >
            <div>
              <button 
                className="confirm-pay-btn" 
                onClick={handlePaySubmit}
                disabled={uiState === UI_STATES.PROCESSING}
              >
                {uiState === UI_STATES.PROCESSING ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <span>Confirm & Pay</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component Header ───
const Checkout = () => {
  const navigate = useNavigate();
  const { lightTap } = useHaptic();

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <button className="header-back-btn" onClick={() => { lightTap(); navigate(-1); }}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="checkout-header-title">
            <h1>Checkout</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <ThemeToggle />
            <div style={{ width: 40 }} /> {/* Spacer */}
          </div>
        </div>
      </header>

      <CheckoutForm />
    </div>
  );
};

export default Checkout;
