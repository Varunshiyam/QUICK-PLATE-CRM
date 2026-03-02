import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useHaptic from '../../hooks/useHaptic';
import '../Home/Home.css';
import './Support.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

const MOCK_ORDERS = [
  {
    id: '88241',
    restaurantName: "Joe's Pizza",
    date: 'Preparing • Estimated 12 mins',
    total: 35.50,
    status: 'ON_THE_WAY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmaoj9PogoCQf6PHxcMgiOcQy-P9_pk4_WOxoaqVktCakcWG2GhCfQ8bSy-JfCzk3lHYjkOhL3jLMlbVurUe__EUfHdnRPmoRlMIOC7vMso-aM3K8xa9lFJEJQDCwdTlJDUgjyO4JBG0OrH5YWoIUb7Cq2LTEipBMId1nCvUM3ZdhQruNggs5fXkdbfMWYPSCGG_AQBaPIOGrymg5GWT3RMuiuBRbsKyIdwoguVtbusy71IcxhmLx9dGh0K6zHq4rACAGZTcvxdzrW'
  },
  {
    id: 'ORD-8842',
    restaurantName: 'The Burger Joint',
    date: '#ORD-8842 • Oct 14, 2023',
    total: 42.00,
    status: 'REFUND_PROCESSING',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmBKw1BoFpHKZAqyOXDU03NwV9AubjTUY-IlLv9Ffe96C1uyIAd9Rwn-beyvHHm8sAu3Ix18smQtMyyNXt0iKuPCkwTEa0sZtRRUnWAskyZL6UiqoCRKy-33nOLWQOx0a-uL3IE9W-IK1mX5z6osvOaU83HYpJCOJYNAIHsj_qrmQEuQopGaXigulUncFANIoun0Ua5VVBnZ0ujiaazMurMWNLw6VfC6cVoIbKw7tFhTAhDw97_f5k8mdHhaG_troUnNbRS4bWenhK',
    ticket: {
        reportedAt: 'Oct 14, 7:15 PM',
        approvedAt: 'Oct 14, 8:45 PM',
        releasedAt: 'Estimated 3-5 days'
    }
  },
  {
    id: 'ORD-9921',
    restaurantName: 'Sushi Zen - Omakase',
    date: 'Order #ORD-9921 • Delivered Oct 12',
    total: 124.50,
    status: 'DELIVERED',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCXw53XVmKro2HruuXClMQnXoeJ5E2HVpYRNt9pN4q-krWmdNyv2d-0qYM-2Sx4X__TqpoxplOLokK2xm0x93RA8lWmnmch5LfVqoV7eYyNJIDBFQusOa-OvZau0_dQdL7ormdMP0obUDKePlOHColI5mtqV_ukkX9QuOmFW4lD-aglUDAcMprscKwYhZHzeDITsiEK_ZEYPCHV8_NuItfyuIs792uwRN--xk1pyvrfB32OyI-l-gRk4zD3R4Jeh8xFeOmKJsq8olb'
  },
  {
    id: 'ORD-7712',
    restaurantName: "Luigi's Pizzeria",
    date: 'Order #ORD-7712 • Oct 08',
    total: 32.00,
    status: 'REFUNDED',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmaoj9PogoCQf6PHxcMgiOcQy-P9_pk4_WOxoaqVktCakcWG2GhCfQ8bSy-JfCzk3lHYjkOhL3jLMlbVurUe__EUfHdnRPmoRlMIOC7vMso-aM3K8xa9lFJEJQDCwdTlJDUgjyO4JBG0OrH5YWoIUb7Cq2LTEipBMId1nCvUM3ZdhQruNggs5fXkdbfMWYPSCGG_AQBaPIOGrymg5GWT3RMuiuBRbsKyIdwoguVtbusy71IcxhmLx9dGh0K6zHq4rACAGZTcvxdzrW'
  }
];

const Support = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersForSupport = async () => {
      try {
        let fetchedOrders = [];
        if (isMockMode) {
          await new Promise(r => setTimeout(r, 600));
          fetchedOrders = MOCK_ORDERS;
        } else {
          try {
            const res = await axios.get(`${API_BASE_URL}/orders`);
            if (res.data && res.data.length > 0) {
              fetchedOrders = res.data;
            } else {
              fetchedOrders = MOCK_ORDERS;
            }
          } catch(e) {
            console.warn("Backend fetch failed, using mock data", e);
            fetchedOrders = MOCK_ORDERS;
          }
        }
        
        // Map backend orders to active support tickets (e.g. Refunds or specifically reported issues)
        const activeTickets = fetchedOrders.filter(o => 
          o.status === 'REFUND_PROCESSING' || o.status === 'REFUNDED' || o.ticket
        );
        
        // Mock DB: Load user-created support tickets from localStorage
        const userTickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
        
        setTickets([...userTickets, ...activeTickets]);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersForSupport();
  }, []);

  const handleActionClick = () => {
    lightTap();
  };

  const handleNotificationClick = () => {
    lightTap();
    const userTickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    if (userTickets.length > 0) {
      toast.success(`Success on raising the Issue: ${userTickets[0].type}`, {
        icon: '🔔',
        style: {
          borderRadius: '12px',
          background: '#1A1D1F',
          color: '#fff',
        }
      });
    } else {
      toast('No new notifications', { icon: '🔕' });
    }
  };

  const handleDeleteTicket = (id, e) => {
    if (e) e.stopPropagation();
    mediumTap();
    const userTickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const updatedTickets = userTickets.filter(t => t.id !== id);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));
    setTickets(prev => prev.filter(t => t.id !== id));
    toast.success('Ticket removed');
  };

  return (
    <div className="support-container">
      <header className="support-header">
        <button className="support-back-btn" onClick={() => { lightTap(); navigate(-1); }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back_ios_new</span>
        </button>
        <h1 className="support-title">Support Center</h1>
        <div className="support-badge-container">
          <button className="support-icon-btn" onClick={handleNotificationClick}>
            <span className="material-symbols-outlined">notifications</span>
            <span className="support-badge"></span>
          </button>
        </div>
      </header>

      <main className="support-main">
        <div className="support-hero">
          <h2>How can we help?</h2>
          <p>Search our knowledge base or track your tickets</p>
        </div>

        <div className="support-search-wrap">
          <label className="support-search-box">
            <span className="material-symbols-outlined support-search-icon">search</span>
            <input 
              type="text" 
              className="support-search-input" 
              placeholder="Search for order help, payments..." 
            />
          </label>
        </div>

        <section className="support-section">
          <div className="support-section-header">
            <h3 className="support-section-title">Quick Actions</h3>
          </div>
          <div className="support-actions-grid">
            <button className="support-action-card" onClick={() => { lightTap(); navigate('/raise-refund'); }}>
              <div className="support-action-icon-wrap">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="support-action-title">Raise a Refund</span>
            </button>
            <button className="support-action-card" onClick={() => { lightTap(); navigate('/order-issue'); }}>
              <div className="support-action-icon-wrap">
                <span className="material-symbols-outlined">package_2</span>
              </div>
              <span className="support-action-title">Order Issues</span>
            </button>
            <button className="support-action-card" onClick={() => { lightTap(); navigate('/payment-issue'); }}>
              <div className="support-action-icon-wrap">
                <span className="material-symbols-outlined">credit_card</span>
              </div>
              <span className="support-action-title">Payment Issue</span>
            </button>
            <button className="support-action-card primary" onClick={() => { mediumTap(); }}>
              <div className="support-action-icon-wrap">
                <span className="material-symbols-outlined">headset_mic</span>
              </div>
              <span className="support-action-title">Chat with Us</span>
            </button>
          </div>
        </section>

        <section className="support-section" style={{ marginBottom: '1rem' }}>
          <div className="support-section-header">
             <h3 className="support-section-title">Active Tickets</h3>
             <a href="#" className="support-view-all" onClick={(e) => { e.preventDefault(); lightTap(); navigate('/orders'); }}>VIEW ALL</a>
          </div>

          <div className="support-tickets-list">
             {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8' }}>
                  <div className="support-pulse-dot" style={{ background: '#f97f1a' }}></div>
                </div>
             ) : tickets.length > 0 ? (
                tickets.map((ticket, idx) => {
                  const isProcessing = ticket.status === 'REFUND_PROCESSING' || ticket.ticket || ticket.status === 'UNDER REVIEW';
                  const caseId = ticket.id.replace('CASE-', '').replace('ORD-', '');
                  return (
                    <div className="support-ticket-card" key={idx}>
                       <div className="support-ticket-accent"></div>
                       <div className="support-ticket-header">
                         <div>
                            <div className="support-ticket-meta">
                              <span className="support-ticket-id">CASE-{caseId}</span>
                              <span className="support-ticket-time">• {ticket.type ? 'Just now' : (isProcessing ? '2h ago' : 'Recently')}</span>
                            </div>
                            <h4 className="support-ticket-title">{ticket.type ? ticket.restaurantName : `Issue with ${ticket.restaurantName}`}</h4>
                            {ticket.type && (
                              <span style={{
                                display: 'inline-block',
                                backgroundColor: '#f97f1a',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                marginTop: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                {ticket.type}
                              </span>
                            )}
                         </div>
                         <span className={`support-ticket-status ${isProcessing ? 'status-review' : 'status-finance'}`}>
                            {ticket.status || (isProcessing ? 'UNDER REVIEW' : 'FINANCE APPROVAL')}
                         </span>
                       </div>
                       
                       <div className="support-ticket-update">
                          <div className="support-pulse-dot-container">
                             <span className="support-pulse-ring"></span>
                             <span className="support-pulse-dot"></span>
                          </div>
                          <p className="support-ticket-desc">
                             {ticket.desc ? (
                                <>{ticket.desc}</>
                             ) : isProcessing ? (
                                <><span>Agent Sarah</span> is investigating the logistics partner.</>
                             ) : (
                                <>Refund of <span className="success-text">${(ticket.total || 0).toFixed(2)}</span> processed by support agent.</>
                             )}
                          </p>
                       </div>
                       {ticket.type && (
                         <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', justifyContent: 'flex-end', marginTop: '-12px' }}>
                           <button 
                             className="support-get-back-btn"
                             onClick={(e) => handleDeleteTicket(ticket.id, e)}
                             style={{
                               backgroundColor: '#ef4444',
                               color: 'white',
                               border: 'none',
                               borderRadius: '8px',
                               padding: '6px 14px',
                               fontSize: '11px',
                               fontWeight: 'bold',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '4px',
                               cursor: 'pointer',
                               transition: 'all 0.2s ease',
                               boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
                             }}
                             onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                             onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                           >
                             <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                             Get back
                           </button>
                         </div>
                       )}
                    </div>
                  );
                })
             ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '1rem' }}>
                   <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#cbd5e1', marginBottom: '0.5rem' }}>assignment_turned_in</span>
                   <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', margin: 0 }}>No active tickets at the moment.</p>
                </div>
             )}
          </div>
        </section>
      </main>

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
          <Link to="/profile" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">person</span>
            <span className="home-nav-label">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Support;
