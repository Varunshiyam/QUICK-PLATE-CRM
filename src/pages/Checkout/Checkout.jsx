import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAppStore from '../../store/useAppStore';
import useHaptic from '../../hooks/useHaptic';
import './Checkout.css';

// ─── Environment & Configuration ───
// Only use Stripe publishable key in frontend
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_key';
const stripePromise = loadStripe(STRIPE_PK);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

const UI_STATES = {
  READY: 'READY_TO_PAY',
  PROCESSING: 'PROCESSING_PAYMENT',
  WAITING: 'WAITING_BACKEND_CONFIRMATION',
  SUCCESS: 'PAYMENT_SUCCESS',
  FAILED: 'PAYMENT_FAILED',
};

// ─── Child Form Component containing Stripe Hooks ───
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { lightTap, heavyTap, successTap, errorTap } = useHaptic();
  
  // App State
  const { cart, getCartTotal, clearCart, cartRestaurant } = useAppStore();

  // Component State
  const [uiState, setUiState] = useState(UI_STATES.READY);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Calculated Totals
  const subtotal = getCartTotal();
  const deliveryFee = 0; // FREE
  const walletApplied = 5.00;
  const taxes = subtotal > 0 ? 4.50 : 0;
  const totalPayStr = Math.max(0, subtotal > 0 ? subtotal + deliveryFee + taxes - walletApplied : 0).toFixed(2);
  const totalPayCents = Math.round(parseFloat(totalPayStr) * 100);

  // Poll Ref to avoid memory leaks
  const pollingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const startBackendPolling = async (orderId) => {
    setUiState(UI_STATES.WAITING);
    let attempts = 0;
    const maxAttempts = 10; // e.g. poll for 30-50 seconds max

    const poll = async () => {
      attempts++;
      try {
        let isPaid = false;
        
        if (isMockMode) {
          // Mocking Salesforce backend confirmation
          await new Promise(r => setTimeout(r, 2000));
          isPaid = true;
        } else {
          // Real backend poll GET /orders/{orderId}
          const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
          if (response.data.Order_Status === 'PAID') isPaid = true;
        }

        if (isPaid) {
          clearInterval(pollingTimerRef.current);
          successTap();
          setUiState(UI_STATES.SUCCESS);
          toast.success('Payment Successful', { icon: '🎉', style: { borderRadius: '2rem', background: '#333', color: '#fff' }});
          
          // Clear cart and redirect automatically after a moment
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

    // Poll every 3 seconds
    pollingTimerRef.current = setInterval(poll, 3000);
    // Instant first poll trigger
    poll();
  };

  const handlePaySubmit = async () => {
    if (!stripe || !elements || !isCardComplete) return;
    heavyTap();
    setUiState(UI_STATES.PROCESSING);
    setErrorMessage('');

    try {
      const orderId = `ORD-${Date.now()}`; // Generate or fetch order ID from context

      // STEP 1: Create Payment Intent
      let clientSecret = '';
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 1200)); // Simulate API delay
        clientSecret = 'pi_mock_sdk_bypass_123';
      } else {
        const intentRes = await axios.post(`${API_BASE_URL}/create-payment-intent`, {
          orderId,
          amount: totalPayCents
        });
        clientSecret = intentRes.data.client_secret;
      }

      // STEP 2: Confirm Payment in Stripe Browser SDK
      const cardElement = elements.getElement(CardElement);
      let paymentResult;
      
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 1500)); // Simulate SDK auth processing
        paymentResult = { paymentIntent: { status: 'succeeded' } };
      } else {
        paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement }
        });
      }

      // STEP 3: Handle Result and Poll Backend
      if (paymentResult.error) {
        throw new Error(paymentResult.error.message || "Payment attempt failed.");
      } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
        startBackendPolling(orderId);
      } else {
        throw new Error('Payment status unknown.');
      }

    } catch (err) {
      errorTap();
      setErrorMessage(err.message || 'An unexpected error occurred processing your payment.');
      setUiState(UI_STATES.FAILED);
    }
  };

  // Stripe Card Formatting 
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#0f172a',
        fontFamily: 'Inter, sans-serif',
        '::placeholder': { color: '#94a3b8' },
        iconColor: '#fb7e18',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
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
                <h3 className="checkout-state-title">Confirming your payment...</h3>
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
                <h3 className="checkout-state-title">Payment Successful!</h3>
                <p className="checkout-state-desc">Your order is confirmed and sent to the kitchen. Redirecting...</p>
              </>
            )}

            {uiState === UI_STATES.FAILED && (
              <>
                <span className="material-symbols-outlined state-icon-large error">error</span>
                <h3 className="checkout-state-title">Payment Failed</h3>
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

      {/* ─── Form Content Layout ─── */}
      <AnimatePresence mode="wait">
        {(uiState === UI_STATES.READY || uiState === UI_STATES.PROCESSING) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            key="checkout-flow"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}
          >
            {/* 1. Order Summary Section */}
            <section>
              <h2 className="checkout-section-title">Order Summary</h2>
              <div className="checkout-card">
                <div className="summary-restaurant">
                  {cartRestaurant?.name || "L'Artisan Bistro"}
                </div>
                <div className="summary-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="summary-item-row">
                      <span className="summary-item-name">{item.quantity}x {item.title || item.name}</span>
                      <span className="summary-item-price">${((item.price) || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bill-details">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="bill-row">
                    <span>Delivery Fee</span>
                    <span style={{ color: '#22c55e', fontWeight: 500 }}>FREE</span>
                  </div>
                  <div className="bill-row">
                    <span>Taxes & Charges</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="bill-row" style={{ color: 'var(--color-primary)' }}>
                    <span>Wallet Applied</span>
                    <span>- ${walletApplied.toFixed(2)}</span>
                  </div>
                  <div className="bill-row total">
                    <span>Final Payable</span>
                    <span className="highlighted-amount">${totalPayStr}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2 & 3. Payment Method Section & Stripe Card */}
            <section>
              <h2 className="checkout-section-title">Payment Method</h2>
              <div className="checkout-card" style={{ padding: '1.5rem' }}>
                <div className="stripe-secure-badge">
                  <span className="material-symbols-outlined">lock</span>
                  <span>Payments secured by Stripe</span>
                </div>
                
                <div className={`stripe-card-wrapper ${isFocused ? 'focus' : ''} ${errorMessage ? 'invalid' : ''}`}>
                  <CardElement 
                    options={cardElementOptions} 
                    onChange={(e) => {
                      setIsCardComplete(e.complete);
                      if (e.error) setErrorMessage(e.error.message);
                      else setErrorMessage('');
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>
                
                {errorMessage && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stripe-error-message">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Pay Button Fixed Overlay */}
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
                className="place-order-btn" 
                onClick={handlePaySubmit}
                disabled={!isCardComplete || uiState === UI_STATES.PROCESSING}
              >
                {uiState === UI_STATES.PROCESSING ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <span className="material-symbols-outlined">lock</span>
                    <span>Pay ${totalPayStr}</span>
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

// ─── Main Export Wrapping Elements Provider ───
const Checkout = () => {
  const navigate = useNavigate();
  const { mediumTap } = useHaptic();

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <button className="cart-icon-btn" onClick={() => { mediumTap(); navigate(-1); }}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="checkout-header-title">
            <h1>Secure Checkout</h1>
          </div>
          <div style={{ width: 40 }} /> {/* Spacer */}
        </div>
      </header>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;
