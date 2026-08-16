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
  const [status, setStatus] = useState('VERIFYING');
  const [errorMessage, setErrorMessage] = useState('');
  const pollingTimerRef = useRef(null);

  useEffect(() => {
    if (!orderId) {
      setStatus('FAILED');
      setErrorMessage('No Order ID found in URL.');
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
        setErrorMessage(err.message || 'Error verifying payment.');
      }
    };

    pollingTimerRef.current = setInterval(verifyPayment, 3000);
    verifyPayment();

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
          <div className="spinner dark state-icon-large pulsing"
            style={{
              borderTopColor: 'var(--color-primary)',
              width: '60px',
              height: '60px',
              margin: '0 auto',
              borderWidth: '4px'
            }}
          />
          <h3 style={{ marginTop: '1.5rem', fontWeight: 600 }}>
            Verifying Payment...
          </h3>
        </motion.div>
      )}

      {status === 'SUCCESS' && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="material-symbols-outlined state-icon-large success"
            style={{ fontSize: '80px', color: '#10b981' }}>
            task_alt
          </span>
          <h3 style={{ marginTop: '1.5rem', fontWeight: 600 }}>
            Payment Successful!
          </h3>
        </motion.div>
      )}

      {status === 'FAILED' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="material-symbols-outlined state-icon-large error"
            style={{ fontSize: '70px', color: '#ef4444' }}>
            error
          </span>
          <h3 style={{ marginTop: '1.5rem', fontWeight: 600 }}>
            Verification Failed
          </h3>
          <p>{errorMessage}</p>
          <button
            style={{
              marginTop: '2rem',
              padding: '14px 28px',
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
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