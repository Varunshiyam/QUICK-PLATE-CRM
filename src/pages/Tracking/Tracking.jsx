import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useHaptic from '../../hooks/useHaptic';
import './Tracking.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

// Mock order fallback
const MOCK_ORDER = {
  id: '88241',
  status: 'ON_THE_WAY', // PLACED, KITCHEN, ON_THE_WAY, ARRIVED
  estimatedTime: '12 mins',
  statusText: 'Arriving in 12 mins',
  statusDesc: "Agent is picking up your order from Joe's Pizza",
  agent: {
    name: 'Carlos M.',
    rating: '4.9',
    deliveries: '1.2k',
    vehicle: 'Honda Civic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFEdBC1kNmMBbTUmoQ48Ha2979YaqlBSkuABJRRA16bnd5TU9vLK17lmn1TDSMZhNIiXB83h5JkvExmkvBK8t-nnnZtRxW-2JyDwKNme3oPruM9JCUN0Fh5dWqeEyVLIsdg9IYjdlgHgeM4Z5jKcIlmN8y4f0AJxX2BRbtxvldy3W6pNgt5kCgh1fzKTb966DhUuKMPJnt9sWhQuW80Gy7fdUKDvJvC1MgGLe1MTqs5IQENds6iBQv9g4WvbbxDCWLL4h7uNCvHLOW'
  }
};

const mapBgUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAoRU-lUkONTP70gC0FEYjupwDWp49p4xhvpiF-Qwri4V16O4tDkiJjCXSJxLLyBbeXiHEmayBHmI11gLQRkZmmKYQZGqZK8_5hutxEgb8gxFLIdoxGc4rKqei7wlF7NGe3A-1jdN1TAzgO9C-x9_CUMqN_Bfa--dQCCfYY9I4RRwkM4_h4yjGJfOx3MJvUaH1PrDQbqoL-OAe-xO8f_2DbA_rYf9FOeqKamioRli_gwktlUp6BT97OFvp6Bqpk3Hy5YtiQP8FgMXn';

const Tracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { lightTap, heavyTap } = useHaptic();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);

  const pollingRef = useRef(null);
  const simIntervalRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        let data = null;

        if (isMockMode) {
          data = {
            orderId,
            orderStatus: 'ASSIGNED',
            agent: { name: 'Carlos M.' }
          };
        } else {
          const res = await axios.get(
            `${API_BASE_URL}/services/apexrest/order/status/${orderId}`
          );
          data = res.data;
        }

        if (data) {
          setOrder(prev => ({
            ...(prev || {}),
            id: data.orderId,
            status: data.orderStatus,
            agent: {
              ...(prev?.agent || MOCK_ORDER.agent),
              name: data.agent?.name || prev?.agent?.name || MOCK_ORDER.agent.name
            },
            estimatedTime: prev?.estimatedTime || MOCK_ORDER.estimatedTime,
            statusText: prev?.statusText || MOCK_ORDER.statusText,
            statusDesc: prev?.statusDesc || MOCK_ORDER.statusDesc
          }));

          if (
            ['ASSIGNED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']
              .includes(data.orderStatus)
          ) {
            if (pollingRef.current) {
               clearInterval(pollingRef.current);
            }
          }
        }

      } catch (err) {
        console.error('Tracking error:', err);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    };

    // First fetch immediately
    fetchStatus();

    // Poll every 3 seconds
    if (!isMockMode) {
      pollingRef.current = setInterval(fetchStatus, 3000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [orderId]);

  // Frontend simulation logic handling page refreshes
  useEffect(() => {
    if (!order) return;
    
    // Check if it's DELIVERED
    if (order.status === 'DELIVERED') {
      const redirectTimer = setTimeout(() => {
        navigate('/orders');
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }

    // Only simulate if the backend status has reached ASSIGNED
    if (['CONFIRMED', 'PREPARING', 'CANCELLED'].includes(order.status)) {
      return;
    }

    const storageKey = `TrackingSimStart_${orderId}`;
    let startTime = parseInt(localStorage.getItem(storageKey), 10);
    
    // First time we hit ASSIGNED, record start time
    if (!startTime && order.status === 'ASSIGNED') {
      startTime = Date.now();
      localStorage.setItem(storageKey, startTime.toString());
    }

    if (startTime) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);

      const updateSimulation = () => {
        const elapsed = Date.now() - startTime;
        let nextStatus = '';
        let timerValue = 0;
        let sDesc = '';
        let sText = '';

        if (elapsed < 8000) {
          nextStatus = 'ASSIGNED';
          timerValue = Math.ceil((8000 - elapsed) / 1000);
          sDesc = 'Agent has been assigned and is heading to the store.';
        } else if (elapsed < 16000) {
          nextStatus = 'PICKED_UP';
          timerValue = Math.ceil((16000 - elapsed) / 1000);
          sDesc = 'Agent has picked up your order.';
        } else if (elapsed < 24000) {
          nextStatus = 'OUT_FOR_DELIVERY';
          timerValue = Math.ceil((24000 - elapsed) / 1000);
          sDesc = 'Agent is on the way to your location!';
        } else {
          nextStatus = 'DELIVERED';
          timerValue = 0;
          sText = 'Delivered';
          sDesc = 'Your order has been delivered! Enjoy your meal.';
        }

        setCountdown(timerValue);
        
        setOrder(prev => {
          if (!prev) return prev;
          if (prev.status !== nextStatus || prev.statusDesc !== sDesc || prev.statusText !== sText) {
            return {
              ...prev,
              status: nextStatus,
              statusDesc: sDesc || prev.statusDesc,
              statusText: sText || prev.statusText
            };
          }
          return prev;
        });

        if (nextStatus === 'DELIVERED') {
          clearInterval(simIntervalRef.current);
          localStorage.removeItem(storageKey);
        }
      };

      updateSimulation(); // run instantly
      simIntervalRef.current = setInterval(updateSimulation, 1000);

      return () => clearInterval(simIntervalRef.current);
    }
  }, [order?.status, orderId, navigate]);

  if (loading || !order) {
    return (
      <div className="track-loading-screen">
        <div className="track-spinner" />
      </div>
    );
  }

  const statuses = [
    'CONFIRMED',
    'PREPARING',
    'ASSIGNED',
    'PICKED_UP',
    'OUT_FOR_DELIVERY',
    'DELIVERED'
  ];
  const currentStatusIndex =
    statuses.indexOf(order.status) >= 0
      ? statuses.indexOf(order.status)
      : 0;

  // Percentage for progress line: 0%, 33.3%, 66.6%, 100%
  const progressPercent = (currentStatusIndex / (statuses.length - 1)) * 100;

  return (
    <div className="track-layout">
      {/* ─── Header ─── */}
      <header className="track-header">
        <button className="track-icon-btn" onClick={() => { lightTap(); navigate(-1); }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="track-header-titles">
          <h2 className="track-h2">Order #{order.id}</h2>
          <p className="track-subtitle">Live Updates</p>
        </div>
        <button className="track-icon-btn" onClick={lightTap}>
          <span className="material-symbols-outlined">support_agent</span>
        </button>
      </header>

      {/* ─── Progress Bar ─── */}
      <div className="track-progress-wrapper">
        <div className="track-progress-track">
          <div className="track-progress-bg" />
          <motion.div 
             className="track-progress-fill"
             initial={{ width: 0 }}
             animate={{ width: `${progressPercent}%` }}
             transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <div className="track-steps-row">
            {/* Step 1: Confirmed */}
            <div className="track-step">
              <div className={`track-step-circle ${currentStatusIndex >= 0 ? 'active' : ''}`}>
                <span className="material-symbols-outlined filled-icon">check</span>
              </div>
              <span className={`track-step-label ${currentStatusIndex >= 0 ? 'active' : ''}`}>Confirmed</span>
            </div>

            {/* Step 2: Preparing */}
            <div className="track-step">
              <div className={`track-step-circle ${currentStatusIndex >= 1 ? 'active' : ''}`}>
                <span className="material-symbols-outlined filled-icon">restaurant</span>
              </div>
              <span className={`track-step-label ${currentStatusIndex >= 1 ? 'active' : ''}`}>Preparing</span>
            </div>

            {/* Step 3: Assigned */}
            <div className="track-step">
              {currentStatusIndex === 2 ? (
                <motion.div 
                  className="track-step-circle active pulse-shadow"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="material-symbols-outlined filled-icon">person</span>
                </motion.div>
              ) : (
                <div className={`track-step-circle ${currentStatusIndex >= 2 ? 'active' : ''}`}>
                  <span className="material-symbols-outlined filled-icon">person</span>
                </div>
              )}
              <span className={`track-step-label ${currentStatusIndex === 2 ? 'active highlight' : (currentStatusIndex > 2 ? 'active' : '')}`}>Assigned</span>
            </div>

            {/* Step 4: Picked Up */}
            <div className="track-step">
              {currentStatusIndex === 3 ? (
                <motion.div 
                  className="track-step-circle active pulse-shadow"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="material-symbols-outlined filled-icon">shopping_bag</span>
                </motion.div>
              ) : (
                <div className={`track-step-circle ${currentStatusIndex >= 3 ? 'active' : ''}`}>
                  <span className="material-symbols-outlined filled-icon">shopping_bag</span>
                </div>
              )}
              <span className={`track-step-label ${currentStatusIndex === 3 ? 'active highlight' : (currentStatusIndex > 3 ? 'active' : '')}`}>Picked Up</span>
            </div>

            {/* Step 5: Out for Delivery */}
            <div className="track-step">
              {currentStatusIndex === 4 ? (
                <motion.div 
                  className="track-step-circle active pulse-shadow large"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="material-symbols-outlined filled-icon large-icon">moped</span>
                </motion.div>
              ) : (
                <div className={`track-step-circle ${currentStatusIndex >= 4 ? 'active' : ''}`}>
                   <span className="material-symbols-outlined filled-icon">moped</span>
                </div>
              )}
              <span className={`track-step-label ${currentStatusIndex === 4 ? 'active highlight' : (currentStatusIndex > 4 ? 'active' : '')}`}>Out for Delivery</span>
            </div>

            {/* Step 6: Delivered */}
            <div className="track-step">
              <div className={`track-step-circle ${currentStatusIndex >= 5 ? 'active' : 'inactive'}`}>
                <span className="material-symbols-outlined">home</span>
              </div>
              <span className={`track-step-label ${currentStatusIndex >= 5 ? 'active' : 'inactive'}`}>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Status Info Box ─── */}
      <div className="track-status-box">
        <h1 className="track-status-title">
          {countdown !== null && countdown > 0
            ? `Updating in 00:${String(countdown).padStart(2, '0')}`
            : order.statusText}
        </h1>
        <p className="track-status-desc">{order.statusDesc}</p>
      </div>

      {/* ─── Map View ─── */}
      <div className="track-map-container">
        <div className="track-map-bg" style={{ backgroundImage: `url('${mapBgUrl}')` }} />
        
        <div className="track-pin shop-pin">
          <div className="track-pin-bubble light-bubble">
            <span className="material-symbols-outlined text-primary">storefront</span>
          </div>
        </div>

        <div className="track-pin agent-pin">
          <motion.div 
            className="track-pin-bubble primary-bubble"
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="material-symbols-outlined filled-icon text-white">moped</span>
          </motion.div>
          <div className="track-pin-badge">MOVING FAST</div>
        </div>

        <div className="track-pin user-pin">
           <div className="track-pin-bubble dark-bubble">
             <span className="material-symbols-outlined">person_pin_circle</span>
           </div>
        </div>
      </div>

      {/* ─── Agent Card ─── */}
      <div className="track-agent-wrapper">
        <div className="track-agent-card">
          <div className="track-agent-avatar-box">
             <div className="track-agent-avatar">
               <img src={order.agent.image} alt="Agent" />
             </div>
             <div className="track-agent-online" />
          </div>

          <div className="track-agent-info">
            <div className="track-agent-name-row">
               <h3 className="track-agent-name">{order.agent.name}</h3>
               <div className="track-agent-rating">
                 <span className="material-symbols-outlined filled-icon text-yellow">star</span>
                 <span className="rating-num">{order.agent.rating}</span>
               </div>
            </div>
            <p className="track-agent-vehicle">{order.agent.vehicle} • {order.agent.deliveries} deliveries</p>
          </div>

          <div className="track-agent-actions">
            <button className="action-btn light-btn" onClick={lightTap}>
              <span className="material-symbols-outlined">chat_bubble</span>
            </button>
            <button className="action-btn primary-btn" onClick={heavyTap}>
              <span className="material-symbols-outlined filled-icon">call</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bottom Navigation ─── */}
      <nav className="track-bottom-nav">
        <a href="/home" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>
          <div className="nav-icon"><span className="material-symbols-outlined">home</span></div>
          <span>HOME</span>
        </a>
        <a href="/discover" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/discover'); }}>
          <div className="nav-icon"><span className="material-symbols-outlined">explore</span></div>
          <span>DISCOVER</span>
        </a>
        <a href="/orders" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>
          <div className="nav-dot" />
          <div className="nav-icon"><span className="material-symbols-outlined filled-icon">receipt_long</span></div>
          <span>ORDERS</span>
        </a>
        <a href="/profile" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
          <div className="nav-icon"><span className="material-symbols-outlined">person</span></div>
          <span>PROFILE</span>
        </a>
      </nav>
    </div>
  );
};

export default Tracking;
