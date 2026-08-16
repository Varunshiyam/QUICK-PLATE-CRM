import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './Offline.css';

/**
 * Premium Offline screen displayed when connection is lost.
 * Integrates glassmorphism, Framer Motion animations, and custom toasts.
 */
export default function Offline() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);

    // Provide a small delay for a high-quality visual feedback loop
    await new Promise((resolve) => setTimeout(resolve, 900));

    try {
      // Attempt a lightweight HEAD request with cache busting to verify real connection
      const response = await fetch(`/vite.svg?t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        mode: 'no-cors' // Ensures request succeeds even with CORS limitations if served locally
      });

      // If the request didn't throw an exception, the user is likely online!
      toast.success('Welcome back! Connection restored.');
      // Dispatch a standard online event to trigger hooks across the app
      window.dispatchEvent(new Event('online'));
    } catch (err) {
      toast.error('Still offline. Please check your Wi-Fi or mobile data.');
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="offline-overlay">
      <motion.div
        className="offline-container"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
      >
        <div className="offline-content">
          {/* Beautiful pulsing icon container */}
          <div className="offline-illustration-wrapper">
            <div className="offline-pulse-circle" />
            <div className="offline-pulse-circle-outer" />
            <div className="offline-icon-box">
              <span className="material-symbols-outlined">wifi_off</span>
            </div>
            <div className="offline-status-badge">
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>

          <h2 className="offline-title">Connection Lost</h2>
          <p className="offline-message">
            We're having trouble reaching the kitchen. Please check your internet connection and try again.
          </p>

          <motion.button
            className={`offline-btn-retry ${isRetrying ? 'spinning' : ''}`}
            onClick={handleRetry}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isRetrying}
          >
            <span className="material-symbols-outlined">sync</span>
            {isRetrying ? 'Checking...' : 'Retry Connection'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
