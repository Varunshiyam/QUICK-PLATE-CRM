import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useHaptic from '../../hooks/useHaptic';
import useAppStore from '../../store/useAppStore';
import { logoutUser } from '../../services/firebase';
import './Profile.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

/* ─── Mock Data ─── */
import userEmoji from '../../assets/images/Emoji.avif';
const USER_IMG = userEmoji;


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Profile = () => {
  const { lightTap, mediumTap } = useHaptic();
  const navigate = useNavigate();
  const { user, logout } = useAppStore();
  
  const [pastDeliveries, setPastDeliveries] = useState([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || '');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isMockMode) {
           const cached = JSON.parse(localStorage.getItem('quickplate_orders') || '[]');
            if (cached.length > 0) {
               const past = cached.filter(o => ['DELIVERED', 'Delivered', 'REFUNDED'].includes(o.status)).slice(0, 3);
               setPastDeliveries(past);
               setTotalOrdersCount(cached.length);
               
               const txns = cached.map(o => {
                 let amountStr = typeof o.total === 'number' ? o.total.toFixed(2) : o.total;
                 return {
                   title: ['REFUNDED', 'Refuned'].includes(o.status) ? `Refund: ${o.restaurantName}` : o.restaurantName,
                   date: o.date,
                   amount: ['REFUNDED', 'Refuned'].includes(o.status) ? `+$${amountStr}` : `-$${amountStr}`,
                   type: ['REFUNDED', 'Refuned'].includes(o.status) ? 'credit' : 'debit',
                   icon: ['REFUNDED', 'Refuned'].includes(o.status) ? 'currency_exchange' : 'receipt_long',
                 };
               }).slice(0, 4);
               setTransactions(txns);
           } else {
               const mockPast = [
                  {
                    id: '#QP-9014',
                    restaurantName: 'Sakura Omakase',
                    date: 'Oct 12, 2026',
                    total: 42.50,
                    status: 'Delivered',
                  },
                  {
                    id: '#QP-8922',
                    restaurantName: 'Masala Tango',
                    date: 'Oct 08, 2026',
                    total: 31.00,
                    status: 'Delivered',
                  },
                  {
                    id: '#QP-8801',
                    restaurantName: 'The Luminary Grill',
                    date: 'Oct 01, 2026',
                    total: 28.75,
                    status: 'Delivered',
                  },
               ];
               setPastDeliveries(mockPast);
               setTotalOrdersCount(3);
               
               const txns = mockPast.map(o => {
                 let amountStr = typeof o.total === 'number' ? o.total.toFixed(2) : o.total;
                 return {
                   title: o.restaurantName,
                   date: o.date,
                   amount: `-$${amountStr}`,
                   type: 'debit',
                   icon: 'receipt_long',
                 };
               });
               setTransactions(txns);
           }
        } else {
            const storedUser = JSON.parse(localStorage.getItem('quickplate_user') || '{}');
            const customerId = storedUser?.customerId;
            if (!customerId) return;
            const res = await axios.get(`${API_BASE_URL}/services/apexrest/customer/orders?customerId=${customerId}`);
            if (res.data && res.data.length > 0) {
              const mappedData = res.data.map(item => ({
                id: item.Id || item.id || 'N/A',
                restaurantName: item.restaurantName || 'Quick Plate Order',
                date: item.CreatedDate ? new Date(item.CreatedDate).toLocaleDateString() : item.date || 'Today',
                total: item.totalAmount || item.total || 0,
                status: item.orderStatus || item.status || 'PLACED',
              }));
              const past = mappedData.filter(o => ['DELIVERED', 'Delivered', 'REFUNDED'].includes(o.status)).slice(0, 3);
              setPastDeliveries(past);
              setTotalOrdersCount(mappedData.length);
              
              const txns = mappedData.map(o => {
                 let amountStr = typeof o.total === 'number' ? o.total.toFixed(2) : o.total;
                 return {
                   title: ['REFUNDED', 'Refuned'].includes(o.status) ? `Refund: ${o.restaurantName}` : o.restaurantName,
                   date: o.date,
                   amount: ['REFUNDED', 'Refuned'].includes(o.status) ? `+$${amountStr}` : `-$${amountStr}`,
                   type: ['REFUNDED', 'Refuned'].includes(o.status) ? 'credit' : 'debit',
                   icon: ['REFUNDED', 'Refuned'].includes(o.status) ? 'currency_exchange' : 'receipt_long',
                 };
              }).slice(0, 4);
              setTransactions(txns);
            }
        }
      } catch (err) {
        console.error('Error fetching orders for profile:', err);
        const cached = JSON.parse(localStorage.getItem('quickplate_orders') || '[]');
        if (cached.length > 0) {
           const past = cached.filter(o => ['DELIVERED', 'Delivered', 'REFUNDED'].includes(o.status)).slice(0, 3);
           setPastDeliveries(past);
           setTotalOrdersCount(cached.length);
           
           const txns = cached.map(o => {
              let amountStr = typeof o.total === 'number' ? o.total.toFixed(2) : o.total;
              return {
                 title: ['REFUNDED', 'Refuned'].includes(o.status) ? `Refund: ${o.restaurantName}` : o.restaurantName,
                 date: o.date,
                 amount: ['REFUNDED', 'Refuned'].includes(o.status) ? `+$${amountStr}` : `-$${amountStr}`,
                 type: ['REFUNDED', 'Refuned'].includes(o.status) ? 'credit' : 'debit',
                 icon: ['REFUNDED', 'Refuned'].includes(o.status) ? 'currency_exchange' : 'receipt_long',
              };
           }).slice(0, 4);
           setTransactions(txns);
        }
      } finally {
        setLoadingDeliveries(false);
      }
    };
    fetchOrders().then(async () => {
      // Wallet Balance (Backend Source of Truth)
      const storedUser = JSON.parse(localStorage.getItem('quickplate_user') || '{}');
      
      let totalBalance = 0;
      if (!isMockMode && storedUser && storedUser.customerId) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/services/apexrest/wallet/balance?customerId=${storedUser.customerId}`
          );
          if (response.data && response.data.success) {
            totalBalance = response.data.availableBalance || 0;
          }
        } catch (err) {
          console.error('Error fetching wallet balance:', err);
        }
      }

      // Merge Wallet Transactions (Fallback balance for mock mode)
      const walletTxnsRaw = JSON.parse(localStorage.getItem('quickplate_wallet_txns') || '[]');
      if (isMockMode || !storedUser?.customerId) {
        totalBalance = walletTxnsRaw.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
      }
      setWalletBalance(totalBalance);

      if (walletTxnsRaw.length > 0) {
         setTransactions(prevTxns => {
            const walletTxns = walletTxnsRaw.map(wt => {
              const amt = parseFloat(wt.amount);
              const isCredit = amt >= 0;
              return {
                title: wt.description || 'Added to Wallet',
                date: new Date(wt.date).toLocaleDateString(),
                amount: `${isCredit ? '+' : '-'}$${Math.abs(amt).toFixed(2)}`,
                type: isCredit ? 'credit' : 'debit',
                icon: isCredit ? 'account_balance_wallet' : 'shopping_bag',
                tag: 'Wallet'
              };
            });
            const allTxns = [...prevTxns, ...walletTxns].sort((a, b) => new Date(b.date) - new Date(a.date));
            return allTxns.slice(0, 4);
         });
      }
    });
  }, []);

  const handleLogout = async () => {
    mediumTap();
    try {
      await logoutUser();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      // still navigate away as fallback
      logout();
      navigate('/');
    }
  };

  const handleDeleteAccount = async () => {
    mediumTap();
    try {
      // Clear all local storage
      localStorage.clear();
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear app state
      logout();
      
      // Log out from Firebase
      await logoutUser();
      
      // Close modal
      setShowDeleteModal(false);
      
      // Navigate to home
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Account deletion failed', error);
      // Fallback: still clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      logout();
      setShowDeleteModal(false);
      navigate('/', { replace: true });
    }
  };

  const dynamicStats = [
    { label: 'Total Orders', value: totalOrdersCount.toString(), icon: 'local_mall', color: 'indigo', action: null },
    { label: 'Favorites', value: '12', icon: 'favorite', color: 'red', action: null },
    { label: 'Wallet', value: `$${walletBalance.toFixed(2)}`, icon: 'account_balance_wallet', color: 'orange', action: () => { mediumTap(); navigate('/customerwallet'); } },
  ];

  return (
    <div className="profile-page">
      {/* ─── Header Top ─── */}
      <header className="profile-header-main">
        <button className="profile-back-btn" onClick={() => { lightTap(); navigate(-1); }}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="profile-page-title">My Profile</h1>
        <button className="profile-edit-btn" onClick={() => { lightTap(); setIsEditing(true); }}>
          <span className="material-symbols-outlined">edit</span>
        </button>
      </header>

      <main className="profile-main-scroll">
        {/* ─── User Banner ─── */}
        <motion.section 
          className="profile-user-banner"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="profile-avatar-large">
            <img src={user?.photoURL || USER_IMG} alt="User Avatar" />
          </div>
          <h2 className="profile-user-name">{user?.displayName || "Foodie Lover"}</h2>
          <p className="profile-user-phone">{user?.email || "foodie@quickplate.com"}</p>
          
          <div className="profile-stats">
            {dynamicStats.map((stat, i) => (
              <div 
                key={i} 
                className={`profile-stat-box ${stat.action ? 'clickable-stat' : ''}`}
                onClick={stat.action || undefined}
                style={stat.action ? { cursor: 'pointer' } : {}}
              >
                <div className={`profile-stat-icon color-${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Past Deliveries ─── */}
        <motion.section 
          className="profile-section"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <div className="profile-section-header">
            <h3>Past Deliveries</h3>
            <button onClick={lightTap}>See all</button>
          </div>
          
          <div className="profile-cards-list">
            {loadingDeliveries ? (
              <p style={{textAlign: 'center', fontSize: '14px', color: '#94a3b8', padding: '1rem'}}>Loading past deliveries...</p>
            ) : pastDeliveries.length > 0 ? (
              pastDeliveries.map((order, i) => (
                <div key={i} className="profile-order-card glass-card">
                  <div className="order-card-top">
                    <div className="order-icon">
                      <span className="material-symbols-outlined">restaurant</span>
                    </div>
                    <div className="order-title-box">
                      <h4>{order.restaurantName || order.restaurant}</h4>
                      <p>{order.date} • {String(order.id).startsWith('#') ? order.id : `#${order.id}`}</p>
                    </div>
                    <div className="order-price">${typeof order.total === 'number' ? order.total.toFixed(2) : order.total || order.amount}</div>
                  </div>
                  <div className="order-card-bottom">
                    <span className="order-items">{order.items || "Standard Order"}</span>
                    <span className={`order-status ${['REFUNDED', 'Refuned'].includes(order.status) ? 'badge-slate' : 'badge-success'}`}>
                      {['DELIVERED', 'Delivered'].includes(order.status) ? 'Delivered' : order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
               <p style={{textAlign: 'center', fontSize: '14px', color: '#94a3b8', padding: '1rem'}}>No past deliveries found.</p>
            )}
          </div>
        </motion.section>

        {/* ─── Transactions ─── */}
        <motion.section 
          className="profile-section"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <div className="profile-section-header">
            <h3>Transaction Details</h3>
            <button onClick={lightTap}>Statement</button>
          </div>
          
          <div className="profile-cards-list">
            {loadingDeliveries ? (
              <p style={{textAlign: 'center', fontSize: '14px', color: '#94a3b8', padding: '1rem'}}>Loading transactions...</p>
            ) : transactions.length > 0 ? (
              transactions.map((tx, i) => (
                <div key={i} className="profile-tx-card glass-card">
                  <div className={`tx-icon ${tx.type === 'credit' ? 'tx-icon-credit' : 'tx-icon-debit'}`}>
                    <span className="material-symbols-outlined">{tx.icon}</span>
                  </div>
                  <div className="tx-info">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {tx.title}
                      {tx.tag === 'Wallet' && (
                         <span style={{ fontSize: '10px', background: '#fb7e18', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Wallet</span>
                      )}
                    </h4>
                    <p>{tx.date}</p>
                  </div>
                  <div className={`tx-amount ${tx.type === 'credit' ? 'tx-amount-green' : ''}`}>
                    {tx.amount}
                  </div>
                </div>
              ))
            ) : (
               <p style={{textAlign: 'center', fontSize: '14px', color: '#94a3b8', padding: '1rem'}}>No transactions found.</p>
            )}
          </div>
        </motion.section>
        
        {/* ─── Action Settings ─── */}
        <motion.section 
          className="profile-section profile-actions-block"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
         <button
  className="profile-action-row glass-card"
  onClick={() => navigate('/dashboard')}
>
  <div className="action-row-left">
    <span>📊</span>
    <span>Analytics Dashboard</span>
  </div>

  <span className="material-symbols-outlined text-slate-300">
    chevron_right
  </span>
</button>

          <button className="profile-action-row glass-card" onClick={() => { mediumTap(); navigate('/support'); }}>
            <div className="action-row-left">
              <span className="material-symbols-outlined text-slate-400">help</span>
              <span>Help & Support</span>
            </div>
            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
          </button>
          
          <button className="profile-action-row glass-card delete-account-row" onClick={() => { mediumTap(); setShowDeleteModal(true); }}>
            <div className="action-row-left">
              <span className="material-symbols-outlined">delete_outline</span>
              <span>Delete Account</span>
            </div>
          </button>
          
          <button className="profile-action-row glass-card logout-row" onClick={handleLogout}>
            <div className="action-row-left">
              <span className="material-symbols-outlined">logout</span>
              <span>Log Out</span>
            </div>
          </button>
        </motion.section>

        {/* Bottom spacer for nav */}
        <div style={{ paddingBottom: '7rem' }} />
      </main>

      {/* ─── Delete Account Confirmation Modal ─── */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <motion.div 
            className="delete-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-header">
              <div className="delete-modal-icon">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h2>Delete Account?</h2>
            </div>

            <p className="delete-modal-description">
              This action cannot be undone. All your profile data, orders, and preferences will be permanently removed.
            </p>

            <div className="delete-modal-info-box">
              <ul className="delete-modal-list">
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Order history will be removed</span>
                </li>
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Wallet balance will be cleared</span>
                </li>
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Saved favorites will be deleted</span>
                </li>
              </ul>
            </div>

            <div className="delete-modal-actions">
              <button 
                className="delete-modal-btn cancel-btn"
                onClick={() => { lightTap(); setShowDeleteModal(false); }}
              >
                Cancel
              </button>
              <button 
                className="delete-modal-btn delete-btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── Bottom Navigation ─── */}
      <nav className="home-bottom-nav">
        <div className="home-bottom-nav-inner">
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">home</span>
            <span className="home-nav-label">Home</span>
          </Link>
          <Link to="/discover" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">explore</span>
            <span className="home-nav-label">Discover</span>
          </Link>
          <Link to="/orders" className="home-nav-item" onClick={lightTap}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="home-nav-badge" />
            </div>
            <span className="home-nav-label">Orders</span>
          </Link>
          <Link to="/profile" className="home-nav-item active" onClick={lightTap}>
            <span className="material-symbols-outlined">person</span>
            <span className="home-nav-label">Profile</span>
          </Link>
        </div>
      </nav>
      {/* ─── Edit Profile Modal ─── */}
      {isEditing && (
        <div className="edit-modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-modal glass-card" onClick={e => e.stopPropagation()}>
            <h3 className="edit-modal-title">Edit Profile</h3>
            
            <div className="edit-modal-avatar">
              <img src={user?.photoURL || USER_IMG} alt="Avatar" />
            </div>

            <div className="edit-modal-field">
              <label>Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Enter your name"
                className="edit-modal-input"
              />
            </div>

            <div className="edit-modal-field">
              <label>Email</label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="edit-modal-input disabled"
              />
              <span className="edit-modal-hint">Email cannot be changed</span>
            </div>

            <div className="edit-modal-actions">
              <button className="edit-modal-cancel" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="edit-modal-save" onClick={() => {
                lightTap();
                if (editName.trim()) {
                  useAppStore.setState(state => ({
                      user: { ...state.user, displayName: editName.trim() }
                  }));
                }
                setIsEditing(false);
              }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
