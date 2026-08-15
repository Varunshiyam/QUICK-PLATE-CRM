import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

const ABANDONMENT_TIME = 15 * 60 * 1000;

export default function CartRecoveryBanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const cart = useAppStore((state) => state.cart);
  const lastCartInteraction = useAppStore(
    (state) => state.lastCartInteraction
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(
      'qp-cart-recovery-dismissed'
    );

    if (
      cart.length > 0 &&
      lastCartInteraction &&
      Date.now() - lastCartInteraction > ABANDONMENT_TIME &&
      !dismissed &&
      location.pathname !== '/cart' &&
      location.pathname !== '/checkout'
    ) {
      setVisible(true);
    }
  }, [cart, lastCartInteraction, location.pathname]);

  const dismiss = () => {
    sessionStorage.setItem(
      'qp-cart-recovery-dismissed',
      'true'
    );
    setVisible(false);
  };

  const continueOrder = () => {
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: '#fff',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            width: 'min(420px, 92vw)',
          }}
        >
          <div>
            <h4
              style={{
                margin: 0,
                marginBottom: 6,
              }}
            >
              🍔 Your cart is waiting
            </h4>

            <p
              style={{
                margin: 0,
                color: '#666',
                fontSize: '0.9rem',
              }}
            >
              {cart.length} item{cart.length > 1 ? 's' : ''} saved
              from your last visit.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 12,
            }}
          >
            <button onClick={continueOrder}>
              Continue Order
            </button>

            <button onClick={dismiss}>
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}