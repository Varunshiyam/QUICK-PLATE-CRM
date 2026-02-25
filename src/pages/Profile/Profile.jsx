import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import useAppStore from '../../store/useAppStore';
import { logoutUser } from '../../services/firebase';
import './Profile.css';

/* ─── Mock Data ─── */
import userEmoji from '../../assets/images/Emoji.avif';
const USER_IMG = userEmoji;

const STATS = [
  { label: 'Total Orders', value: '47', icon: 'local_mall', color: 'indigo' },
  { label: 'Favorites', value: '12', icon: 'favorite', color: 'red' },
  { label: 'Reviews', value: '8', icon: 'star', color: 'yellow' },
];

const PAST_DELIVERIES = [
  {
    id: '#QP-9014',
    restaurant: 'Sakura Omakase',
    date: 'Oct 12, 2026',
    items: '2x Spicy Tuna Roll, 1x Miso Soup',
    amount: '$42.50',
    status: 'Delivered',
  },
  {
    id: '#QP-8922',
    restaurant: 'Masala Tango',
    date: 'Oct 08, 2026',
    items: '1x Chicken Tikka, 2x Garlic Naan',
    amount: '$31.00',
    status: 'Delivered',
  },
  {
    id: '#QP-8801',
    restaurant: 'The Luminary Grill',
    date: 'Oct 01, 2026',
    items: '1x Truffle Burger, 1x Loaded Fries',
    amount: '$28.75',
    status: 'Delivered',
  },
];

const TRANSACTIONS = [
  {
    title: 'Added to Wallet',
    date: 'Oct 10, 2026',
    amount: '+$50.00',
    type: 'credit',
    icon: 'account_balance_wallet',
  },
  {
    title: 'Order Refund',
    date: 'Sep 25, 2026',
    amount: '+$14.20',
    type: 'credit',
    icon: 'currency_exchange',
  },
  {
    title: 'Quick Plate Pro Sub',
    date: 'Sep 01, 2026',
    amount: '-$9.99',
    type: 'debit',
    icon: 'workspace_premium',
  },
];

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

  return (
    <div className="profile-page">
      {/* ─── Header Top ─── */}
      <header className="profile-header-main">
        <button className="profile-back-btn" onClick={() => { lightTap(); navigate(-1); }}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="profile-page-title">My Profile</h1>
        <button className="profile-edit-btn" onClick={lightTap}>
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
            {STATS.map((stat, i) => (
              <div key={i} className="profile-stat-box">
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
            {PAST_DELIVERIES.map((order, i) => (
              <div key={i} className="profile-order-card glass-card">
                <div className="order-card-top">
                  <div className="order-icon">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>
                  <div className="order-title-box">
                    <h4>{order.restaurant}</h4>
                    <p>{order.date} • {order.id}</p>
                  </div>
                  <div className="order-price">{order.amount}</div>
                </div>
                <div className="order-card-bottom">
                  <span className="order-items">{order.items}</span>
                  <span className="order-status badge-success">{order.status}</span>
                </div>
              </div>
            ))}
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
            {TRANSACTIONS.map((tx, i) => (
              <div key={i} className="profile-tx-card glass-card">
                <div className={`tx-icon ${tx.type === 'credit' ? 'tx-icon-credit' : 'tx-icon-debit'}`}>
                  <span className="material-symbols-outlined">{tx.icon}</span>
                </div>
                <div className="tx-info">
                  <h4>{tx.title}</h4>
                  <p>{tx.date}</p>
                </div>
                <div className={`tx-amount ${tx.type === 'credit' ? 'tx-amount-green' : ''}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
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
          <button className="profile-action-row glass-card" onClick={lightTap}>
            <div className="action-row-left">
              <span className="material-symbols-outlined text-slate-400">help</span>
              <span>Help & Support</span>
            </div>
            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
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

      {/* ─── Bottom Navigation ─── */}
      <nav className="home-bottom-nav">
        <div className="home-bottom-nav-inner">
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">home</span>
            <span className="home-nav-label">Home</span>
          </Link>
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">explore</span>
            <span className="home-nav-label">Discover</span>
          </Link>
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
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
    </div>
  );
};

export default Profile;
