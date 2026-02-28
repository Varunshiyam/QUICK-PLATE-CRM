import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../../store/useAppStore';
import useHaptic from '../../hooks/useHaptic';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
const isMockMode = !API_BASE_URL;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const { clearCart } = useAppStore();
  const { success, error } = useHaptic();  
  const [status, setStatus] = useState('VERIFYING'); // VERIFYING, SUCCESS, FAILED
  const [errorMessage, setErrorMessage] = useState('');
  const pollingTimerRef = useRef(null);

  useEffect(() => {
    if (!orderId) {
       setStatus('FAILED');
       setErrorMessage('No Order ID found in URL. Are you sure you completed the payment?');
       error?.();
       return;
    }

    let attempts = 0;
    const maxAttempts = 15;

    const verifyPayment = async () => {
      attempts++;
      try {
        let isPaid = false;
        
        if (isMockMode) {
           await new Promise(r => setTimeout(r, 2000));
           isPaid = true;
        } else {
           const response = await axios.get(
            `${API_BASE_URL}/services/apexrest/order/status/${orderId}`
           );
           
           // Based on the prompt reference: "if (response.data.paymentStatus === 'PAID')"
           if (response.data?.paymentStatus === 'PAID') {
             isPaid = true;
           }
        }

        if (isPaid) {
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          success?.();
          setStatus('SUCCESS');
          
          setTimeout(() => {
            clearCart();
            navigate(`/tracking/${orderId}`, { replace: true });
          }, 3500);
        } else if (attempts >= maxAttempts) {
           throw new Error('Verification timeout. Please contact support.');
        }
      } catch (err) {
        if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
        error?.();
        setStatus('FAILED');
        setErrorMessage(err.message || 'Error communicating with backend to verify payment.');
      }
    };

    pollingTimerRef.current = setInterval(verifyPayment, 3000);
    verifyPayment(); // call once immediately

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [orderId, clearCart, navigate, success, error]);

  return (
    <div className="payment-success-page" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100dvh', 
      background: '#FDFCFB',
      padding: '24px',
      textAlign: 'center'
    }}>
       {status === 'VERIFYING' && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
           <div 
             className="spinner dark state-icon-large pulsing" 
             style={{ 
               borderTopColor: 'var(--color-primary)', 
               width: '60px', 
               height: '60px', 
               margin: '0 auto',
               borderWidth: '4px'
             }} 
           />
           <h3 style={{ marginTop: '1.5rem', fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>
             Verifying Payment...
           </h3>
           <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
             Please do not close this window while we securely confirm your translation with Stripe.
           </p>
         </motion.div>
       )}

       {status === 'SUCCESS' && (
         <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
           <span 
             className="material-symbols-outlined state-icon-large success" 
             style={{ fontSize: '80px', color: '#10b981' }}
           >
             task_alt
           </span>
           <h3 style={{ marginTop: '1.5rem', fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>
             Payment Successful!
           </h3>
           <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#64748B' }}>
             Yay! Your order has been successfully sent to the kitchen.
           </p>
           <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
             Redirecting you to the tracking page...
           </p>
         </motion.div>
       )}

       {status === 'FAILED' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
           <span 
             className="material-symbols-outlined state-icon-large error" 
             style={{ fontSize: '70px', color: '#ef4444' }}
           >
             error
           </span>
           <h3 style={{ marginTop: '1.5rem', fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>
             Verification Failed
           </h3>
           <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#64748B' }}>
             {errorMessage}
           </p>
           <button 
             style={{ 
               marginTop: '2rem', 
               padding: '14px 28px', 
               background: 'var(--color-primary)', 
               color: '#fff', 
               borderRadius: '12px', 
               border: 'none',
               fontSize: '1rem',
               fontWeight: 600,
               width: '100%',
               cursor: 'pointer'
             }}
             onClick={() => navigate('/home')}
           >
             Return to Home
           </button>
         </motion.div>
       )}
    </div>
  );
};

export default PaymentSuccess;
