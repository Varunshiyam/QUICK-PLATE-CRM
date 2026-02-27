import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAppStore from '../../store/useAppStore';
import useHaptic from '../../hooks/useHaptic';
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
  const { lightTap, heavyTap, successTap, errorTap, mediumTap } = useHaptic();
  
  const { cart, getCartTotal, clearCart } = useAppStore();
  
  const storedUser = getStoredUser();
  const deliveryAddress = storedUser?.address || '452 West 19th Street, Apt 4B\nChelsea, New York, NY 10011';

  const [uiState, setUiState] = useState(UI_STATES.READY);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Payment Method Selection (Only capturing mode now)
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'cod'
  
  // Calculated Totals
  const subtotal = getCartTotal();
  const deliveryFee = 0; // FREE
  const walletApplied = 5.00;
  const taxes = subtotal > 0 ? 4.50 : 0;
  const totalPayStr = Math.max(0, subtotal > 0 ? subtotal + deliveryFee + taxes - walletApplied : 0).toFixed(2);
  const totalPayCents = Math.round(parseFloat(totalPayStr) * 100);

  const pollingTimerRef = useRef(null);

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
          const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
          if (response.data.Order_Status === 'PAID') isPaid = true;
        }

        if (isPaid) {
          clearInterval(pollingTimerRef.current);
          successTap();
          setUiState(UI_STATES.SUCCESS);
          
          setTimeout(() => {
            clearCart();
            navigate('/home', { replace: true });
          }, 2000);
        } else if (attempts >= maxAttempts) {
          throw new Error('Verification timeout. Please contact support.');
        }
      } catch (err) {
        clearInterval(pollingTimerRef.current);
        errorTap();
        setErrorMessage(err.message || 'Error communicating with backend.');
        setUiState(UI_STATES.FAILED);
      }
    };

    pollingTimerRef.current = setInterval(poll, 3000);
    poll();
  };

  const handlePaySubmit = async () => {
    heavyTap();
    setUiState(UI_STATES.PROCESSING);
    setErrorMessage('');

    try {
      const orderId = `ORD-${Date.now()}`;

      // Unified Generic Payment Submission
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 1500));
      } else {
        await axios.post(`${API_BASE_URL}/create-payment-intent`, {
           orderId, amount: totalPayCents, method: paymentMethod
        }).catch(() => {});
      }
      
      startBackendPolling(orderId);
    } catch (err) {
      errorTap();
      setErrorMessage(err.message || 'An unexpected error occurred processing your order.');
      setUiState(UI_STATES.FAILED);
    }
  };

  return (
    <div className="checkout-content">
      {/* ─── State Modals ─── */}
      <AnimatePresence mode="wait">
        {(uiState === UI_STATES.WAITING || uiState === UI_STATES.SUCCESS || uiState === UI_STATES.FAILED) && (
          <motion.div 
            className="checkout-state-overlay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key="state-overlay"
          >
            {uiState === UI_STATES.WAITING && (
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
                  onClick={() => { lightTap(); setUiState(UI_STATES.READY); setErrorMessage(''); }}
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
              <div className="co-pay-card">
                <div className="co-pay-left">
                  <div className="amount-label">Amount to Pay</div>
                  <div className="amount-value">${totalPayStr}</div>
                </div>
                <div className="co-pay-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>receipt_long</span>
                </div>
              </div>
            </div>

            {/* ─── Section: Payment Method ─── */}
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
          <div style={{ width: 40 }} /> {/* Spacer */}
        </div>
      </header>

      <CheckoutForm />
    </div>
  );
};

export default Checkout;
