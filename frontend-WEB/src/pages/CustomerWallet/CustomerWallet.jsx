import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useHaptic from '../../hooks/useHaptic';
import { getStoredUser } from '../../services/firebase';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import './CustomerWallet.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const CustomerWallet = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();
  
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadWalletData = async () => {
      // Local Storage Transactions
      const txns = JSON.parse(localStorage.getItem('quickplate_wallet_txns') || '[]');
      const validTxns = txns.filter(tx => {
        const amt = parseFloat(tx.amount) || 0;
        return (amt > 0 && (tx.type === 'Wallet' || !tx.type)) || 
               (amt < 0 && (tx.type === 'Order Deduct' || tx.description?.toLowerCase().includes('order')));
      });
      setTransactions(validTxns);

      // Wallet Balance (Backend Source of Truth)
      const storedUser = getStoredUser();
      
      if (!isMockMode && storedUser && storedUser.firebaseIdToken) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/services/apexrest/wallet/balance?token=${encodeURIComponent(storedUser.firebaseIdToken)}`
          );
          if (response.data && response.data.success) {
            setBalance(response.data.availableBalance || 0);
          } else {
            console.warn('Backend returned success: false for balance', response.data);
          }
        } catch (err) {
          console.error('Error fetching wallet balance:', err);
        }
      } else {
        // Fallback for Mock Mode
        const currentBalance = validTxns.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
        setBalance(currentBalance);
      }
    };

    loadWalletData();
    window.addEventListener('storage', loadWalletData);
    window.addEventListener('focus', loadWalletData);
    
    // Poll every 5 seconds 
    const intervalId = setInterval(loadWalletData, 5000);
    
    return () => {
      window.removeEventListener('storage', loadWalletData);
      window.removeEventListener('focus', loadWalletData);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="wallet-page">
      <header className="wallet-header">
        <button className="wallet-back-btn" onClick={() => { lightTap(); navigate(-1); }}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="wallet-title">My Wallet</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <ThemeToggle />
          <div style={{ width: 24 }} /> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="wallet-main">
        <motion.div 
          className="wallet-balance-card"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <p className="balance-label">Available Balance</p>
          <h2 className="balance-amount">${balance.toFixed(2)}</h2>
        </motion.div>

        <motion.div 
          className="wallet-actions"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <button className="action-btn" onClick={() => { mediumTap(); navigate('/wallet-payment'); }}>
            <div className="action-icon">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span>Add Funds</span>
          </button>
          <button className="action-btn" onClick={mediumTap}>
            <div className="action-icon">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span>Withdraw</span>
          </button>
        </motion.div>

        <motion.div 
          className="recent-activity"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <h3 className="activity-title">Recent Activity</h3>
          {transactions.length > 0 ? (
            <div className="wallet-txns-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map((tx, idx) => (
                <div key={idx} className="wallet-txn-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  gap: '12px'
                }}>
                  <div className="txn-icon" style={{
                    width: 40, height: 40, borderRadius: '50%', background: parseFloat(tx.amount) >= 0 ? '#e6ffe6' : '#ffe6e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: parseFloat(tx.amount) >= 0 ? '#00B894' : '#FF7675'
                  }}>
                    <span className="material-symbols-outlined">{parseFloat(tx.amount) >= 0 ? 'add_card' : 'shopping_bag'}</span>
                  </div>
                  <div className="txn-details" style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#1a202c' }}>
                      {parseFloat(tx.amount) >= 0 ? (tx.description || 'Added to Wallet') : (tx.description || 'Used for Order')}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#718096' }}>
                      {parseFloat(tx.amount) >= 0 ? 'Credit Transaction' : 'Debit Transaction'} • {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="txn-amount" style={{ fontSize: '14px', fontWeight: 'bold', color: parseFloat(tx.amount) >= 0 ? '#00B894' : '#FF7675' }}>
                    {parseFloat(tx.amount) >= 0 ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
               <span className="material-symbols-outlined">receipt_long</span>
               <p>No recent wallet transactions.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CustomerWallet;
