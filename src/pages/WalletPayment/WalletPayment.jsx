import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useHaptic from '../../hooks/useHaptic';
import { getStoredUser } from '../../services/firebase';
import './WalletPayment.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

const WalletPayment = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap, heavyTap } = useHaptic();
  
  const [amount, setAmount] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle card formatting
  const handleCardChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    if (value.length <= 19) setCardNo(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (value.length <= 5) setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) setCvv(value);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || !cardNo || !expiry || !cvv || !name) {
      lightTap();
      return;
    }
    
    mediumTap();
    setIsProcessing(true);

    try {
      const numAmount = parseFloat(amount);
      const storedUser = getStoredUser();

      if (!isMockMode) {
        if (!storedUser?.customerId) {
          throw new Error('User session expired. Please login again.');
        }

        await axios.post(
          `${API_BASE_URL}/services/apexrest/wallet/add-funds`,
          {
            customerId: storedUser.customerId,
            amount: numAmount
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        await new Promise(r => setTimeout(r, 2500));
      }

      setIsProcessing(false);
      setIsSuccess(true);
      heavyTap();

      // Save Transaction
      const newTxn = {
        id: 'WTX-' + Math.floor(100000 + Math.random() * 900000),
        amount: numAmount,
        date: new Date().toISOString(),
        type: 'Wallet',
        description: 'Wallet Top-up'
      };

      const existingTxns = JSON.parse(localStorage.getItem('quickplate_wallet_txns') || '[]');
      localStorage.setItem('quickplate_wallet_txns', JSON.stringify([newTxn, ...existingTxns]));

      setTimeout(() => {
        navigate('/customerwallet', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Add Funds Error:', err);
      setIsProcessing(false);
      alert(err.message || 'Failed to add funds to wallet.');
    }
  };

  return (
    <div className="rzp-container">
      <AnimatePresence>
        {!isSuccess ? (
          <motion.div 
            className="rzp-card"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header / Logo section */}
            <div className="rzp-header">
              <div className="rzp-logo-container">
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#fb7e18' }}>fastfood</span>
                <div className="rzp-brand">
                  <h2>QUICK PLATE</h2>
                  <p>Wallet Payment</p>
                </div>
              </div>
              <button className="rzp-close" onClick={() => navigate(-1)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="rzp-form" onSubmit={handlePayment}>
              {/* Amount Input */}
              <div className="rzp-amount-section">
                <label>Amount to Add</label>
                <div className="rzp-amount-input-wrapper">
                  <span className="rzp-currency">$</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="0.00"
                    step="0.01"
                    min="1"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="rzp-divider">
                <span>Payment Details</span>
              </div>

              {/* Card Inputs */}
              <div className="rzp-input-group">
                <label>Card Number</label>
                <div className="rzp-input-icon">
                  <span className="material-symbols-outlined">credit_card</span>
                  <input 
                    type="text" 
                    value={cardNo} 
                    onChange={handleCardChange} 
                    placeholder="4000 1234 5678 9010"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="rzp-row">
                <div className="rzp-input-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    value={expiry} 
                    onChange={handleExpiryChange} 
                    placeholder="MM/YY"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="rzp-input-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    value={cvv} 
                    onChange={handleCvvChange} 
                    placeholder="123"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="rzp-input-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe"
                  required
                  disabled={isProcessing}
                />
              </div>

              <button 
                type="submit" 
                className={`rzp-submit-btn ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing || !amount}
              >
                {isProcessing ? (
                  <div className="rzp-spinner"></div>
                ) : (
                  `Pay $${amount ? parseFloat(amount).toFixed(2) : '0.00'}`
                )}
              </button>
              
              <div className="rzp-secure-badge">
                <span className="material-symbols-outlined">lock</span>
                Secured by Quick Plate
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            className="rzp-success-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <motion.div 
              className="rzp-success-circle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <span className="material-symbols-outlined">check</span>
            </motion.div>
            <h3>Payment Successful</h3>
            <p>Your wallet has been credited with ${parseFloat(amount).toFixed(2)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletPayment;
