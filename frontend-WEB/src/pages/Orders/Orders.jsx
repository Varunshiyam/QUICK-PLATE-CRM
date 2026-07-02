import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useHaptic from '../../hooks/useHaptic';
import '../Home/Home.css';
import './Orders.css';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';

import imgMorningBliss from '../../assets/images/MissMatched_Pics/Morning Bliss Bakery.avif';
import imgNapoliWoodfired from '../../assets/images/MissMatched_Pics/Napoli Woodfired Pizza.avif';
import imgSliceStone from '../../assets/images/MissMatched_Pics/Slice & Stone.avif';
import imgSmashStack from '../../assets/images/MissMatched_Pics/Smash & Stack Burgers.avif';
import imgSweetTooth from '../../assets/images/MissMatched_Pics/Sweet Tooth Confections.avif';
import imgMeltdownGrill from '../../assets/images/MissMatched_Pics/The Meltdown Grill.avif';
import imgTokyoNights from '../../assets/images/MissMatched_Pics/Tokyo Nights Rollhous.avif';
import imgZenSushi from '../../assets/images/MissMatched_Pics/Zen Sushi Lounge.avif';
import sushiPlatter from '../../assets/images/sushi-platter.png';

const IMG = {
  pasta:   'https://lh3.googleusercontent.com/aida-public/AB6AXuA7rRqrqQB8WlaPGEnNWpyhdP-PJiwWeP9SL--8b8mCFbqKRAp8ySZBcYOpWC_osbofXS3FhMghzEXj1WzAaysflWk79zTtw2OoN2T4ee7Pn11Vz1rp70xvF0DrnMANaRwY0eY_NkDxVjU6sWQZnxB2xST9n-j0F9KjFKd0_F3y0AAb6T6FGtcLSf9_fTcnrVht3s_SleVk3_bbyLHzFFgZfcamgnzB2vShoIxaY7XRlH3T-419ipyigS7bRFKP0kNFoG0G5NrpCN_K',
  grill:   'https://lh3.googleusercontent.com/aida-public/AB6AXuDRVg4WHeLML4GR_FT_Qw2vnFTiy1T2ux5QaExfnIcN-9F5ma-BjKPAo0Qw7V_C2vQqA3UsAkfzKR5h7oAGr5lT4FN9Nui8lhC2Qal40qJvGanldNT3FvbzyVUMbAkvSOoDmsMfY0QHgkZOjWPpEdWXjwQxDotyzhlPzhpK9rB3i9gL076JH9wnsX5SHq_NS0dEWW7UIs5a4TIM86doVTMv5orv5tGlXzV0OZFq8laVjkiJW3WSdzMBtaCEgOMGTfabbkykSkvUp17R',
  sushi:   sushiPlatter,
  burger:  'https://lh3.googleusercontent.com/aida-public/AB6AXuBIVLq7cg2DsY4Dw1Dv-N3mH1ev7hGiwMSEtAkMb41GEGZ3NWK7evAuqaBMyAPxKkiWfWKvgy0nDn19gJTl36RHd5hphjpBZEHwnD5zk20Xz3OOqpcEORX-TSKWVxR8Sq03vPIHUrMBpMSwfx8YauQJCYaM9mvF_O0B0wiiuU6A1tz_aSdynsxPxodhs5brxxdbojLh_t-ic0gUZNfT-lRUTmhxPYdl_r1BhB55YUDUtCc1hXK1RrtsjFHPykKJvwn2ChzHDcNNp9Px',
  dessert: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOhl1yjOKt_cFiqW9w_vcZMp1dEUEqSkIF_1PZ2iIkZrAMPdZWmq5nS0UsAxyiyLEANe-rPR00vzNRPE7gtW5F_ZxagryLxi0ew6lKQX3HlNyzqu5iDJHCJ5K-lyvjvro7takNhJHZXCemHKBQWECAbNr0M7UqsYN56Y7IwMX3szaterAKcLL9gjnTAhk1Z5X2ZjsrOEQUEbt_qilhyYQDuwE2oaBRpNEGotfphSL4XSiYM5zKYG8L2ce2Prupm8XZIwamR4fa9m0p',
  salad:   'https://lh3.googleusercontent.com/aida-public/AB6AXuBZH03LnZFjClUcB8auLGFe4iXGTZKPwtoc_7earTpfFLFpyJCZs0HnZvrIO9lRdlin_owGopgjo-eMqf8FxKWEdpRN11FShwLWF9Z7l7FV4qhusFk-YM9Ks3x-rR0l5pwRW6qQw9GcaCIK3IqOd9Nz0uQQzjdk9sAMRsSGOCpGXdvHjngM0ys6JcRfgZOyFuc2oxVMdee-vgSsOXFYq0vfqrhchkpb3dIRU1wD8DmpC7q6DlUQgQqjy4q2ZHuM5uOaqz6FmsWuOjuR',
  masala:  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2571&auto=format&fit=crop',
  tart:    'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2574&auto=format&fit=crop',
  pastry:  'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=2630&auto=format&fit=crop',
  cake:    'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=2536&auto=format&fit=crop',
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

const MOCK_ORDERS = [
  {
    id: '88241',
    restaurantName: "Joe's Pizza",
    date: 'Preparing • Estimated 12 mins',
    total: 35.50,
    status: 'ON_THE_WAY', // Active order
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

const getMappedImage = (restaurantName) => {
  if (!restaurantName) return MOCK_ORDERS[0].image;
  if (restaurantName.includes("Morning Bliss")) return imgMorningBliss;
  if (restaurantName.includes("Napoli Woodfired")) return imgNapoliWoodfired;
  if (restaurantName.includes("Slice & Stone")) return imgSliceStone;
  if (restaurantName.includes("Smash & Stack")) return imgSmashStack;
  if (restaurantName.includes("Sweet Tooth")) return imgSweetTooth;
  if (restaurantName.includes("Meltdown Grill")) return imgMeltdownGrill;
  if (restaurantName.includes("Tokyo Nights")) return imgTokyoNights;
  if (restaurantName.includes("Zen Sushi")) return imgZenSushi;
  if (restaurantName.includes("Grill")) return IMG.grill;
  if (restaurantName.includes("Masala")) return IMG.masala;
  if (restaurantName.includes("Sakura") || restaurantName.includes("Omakase")) return IMG.sushi;
  if (restaurantName.includes("Smokehouse")) return IMG.burger;
  if (restaurantName.includes("Green & Grain")) return IMG.salad;
  return MOCK_ORDERS[0].image;
};

const Orders = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockPastTickets = [
    { id: 'CS-291', restaurantName: 'Sakura Omakase', price: 248.0, status: 'RESOLVED', image: IMG.sushi },
    { id: 'CS-104', restaurantName: 'Smokehouse BBQ Co.', price: 65.0, status: 'CLOSED', image: IMG.burger }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isMockMode) {
          await new Promise(r => setTimeout(r, 600));
          setOrders(MOCK_ORDERS);
          localStorage.setItem('quickplate_orders', JSON.stringify(MOCK_ORDERS));
        } else {
          try {
            const storedUser = JSON.parse(localStorage.getItem('quickplate_user') || '{}');
            const idToken = storedUser?.firebaseIdToken;
            if (!idToken) {
              console.warn("No token found. Cannot fetch orders.");
              setOrders([]);
              return;
            }
            const res = await axios.get(`${API_BASE_URL}/services/apexrest/customer/orders?idToken=${encodeURIComponent(idToken)}`);
            if (res.data && res.data.orders && res.data.orders.length > 0) {
              const mappedData = res.data.orders.map(item => {
                const restaurantName = item.restaurantName || 'Quick Plate Order';
                return {
                  id: item.Id || item.id || 'N/A',
                  restaurantName: restaurantName,
                  date: item.createdDate ? new Date(item.createdDate).toLocaleDateString() : item.date || 'Today',
                  total: item.totalAmount || item.total || 0,
                  status: item.orderStatus || item.status || 'PLACED',
                  paymentStatus: item.paymentStatus || '',
                  image: item.image || getMappedImage(restaurantName)
                };
              });
              setOrders(mappedData);
              localStorage.setItem('quickplate_orders', JSON.stringify(mappedData));
            } else {
              setOrders([]);
              localStorage.setItem('quickplate_orders', JSON.stringify([]));
            }
          } catch(e) {
            console.warn("Backend fetch failed", e);
            setOrders([]);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
        setSupportTickets(tickets);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleTrackOrder = (orderId) => {
    mediumTap();
    navigate(`/tracking/${orderId}`);
  };

  const activeStatuses = ['ON_THE_WAY', 'PLACED', 'Payment Succeeded', 'CONFIRMED', 'PREPARING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'];
  const activeOrders = orders.filter(order => activeStatuses.includes(order.status) || order.paymentStatus === 'Payment Succeeded');
  const refundProcessingOrders = orders.filter(order => order.status === 'REFUND_PROCESSING' || order.status === 'Refund Processing');
  const pastOrders = orders.filter(order => order.status === 'DELIVERED' || order.status === 'Delivered' || order.status === 'REFUNDED').slice(0, 8);

  return (
    <div className="orders-layout orders-page-bg">
      {/* ─── Header ─── */}
      <header className="orders-glass-header">
  <div className="orders-header-left">
    <button className="orders-back-btn" onClick={() => { lightTap(); navigate(-1); }}>
      <span className="material-symbols-outlined text-primary font-bold">arrow_back_ios</span>
    </button>
    <h1>{activeTab === 'orders' ? 'Order History' : 'Support Tickets'}</h1>
  </div>
  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
    <ThemeToggle />
    <button className="orders-search-btn" onClick={lightTap}>
      <span className="material-symbols-outlined text-primary text-[22px]">search</span>
    </button>
  </div>
</header>

      <div className="orders-toggle-wrap">
        <div className="orders-toggle-box">
          <button 
             className={`orders-toggle-btn ${activeTab === 'orders' ? 'active' : ''}`}
             onClick={() => { lightTap(); setActiveTab('orders'); }}
          >Past Orders</button>
          <button 
             className={`orders-toggle-btn ${activeTab === 'tickets' ? 'active' : ''}`}
             onClick={() => { lightTap(); setActiveTab('tickets'); }}
          >Support Tickets</button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="orders-main">
        {loading ? (
          <div className="orders-loading">
            <div className="orders-spinner" />
          </div>
        ) : (
          <div className="orders-sections-container">
            {/* CURRENT ORDER SECTION */}
            {activeTab === 'orders' && activeOrders.length > 0 && (
              <div className="orders-section">
                <h2 className="orders-title-premium">Current Order</h2>
                <div className="orders-list">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="orders-card-premium">
                      <div className="order-flex-row gap-4">
                        <div className="orders-pic-premium" style={{ backgroundImage: `url('${order.image}')` }} />
                        <div className="flex-1">
                          <div className="order-flex-between items-start">
                            <h3 className="font-bold text-lg leading-tight" style={{ color: '#1e293b' }}>{order.restaurantName}</h3>
                            <span className="text-sm font-bold" style={{ color: '#0f172a' }}>${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Order #{order.id} • {order.date}</p>
                          
                          <div className={`status-pill ${['DELIVERED', 'Delivered'].includes(order.status) ? 'status-slate' : 'status-orange'}`}>
                            <span className="material-symbols-outlined filled-icon">
                              {['DELIVERED', 'Delivered'].includes(order.status) ? 'check_circle' : 'moped'}
                            </span>
                            {order.status === 'Payment Succeeded' || order.paymentStatus === 'Payment Succeeded' ? 'Payment Succeeded' : (
                                ['CONFIRMED', 'PREPARING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ON_THE_WAY', 'PLACED'].includes(order.status) ? order.status.replace(/_/g, ' ') : order.status
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                         className="btn-track-premium"
                         onClick={() => handleTrackOrder(order.id)}
                      >
                        Track Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================= */}
            {/* SUPPORT TICKETS SECTION */}
            {/* ======================= */}
            {activeTab === 'tickets' && (
              <>
                <div className="orders-section mt-4">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="orders-title-premium" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Active Tickets
                      <span className="tickets-badge-count">{supportTickets.length + refundProcessingOrders.length}</span>
                    </h2>
                    <button className="tickets-new-issue-btn" onClick={() => { mediumTap(); navigate('/support'); }}>
                      New Issue
                    </button>
                  </div>
                  
                  {supportTickets.length === 0 && refundProcessingOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                       <p style={{ fontWeight: 600 }}>No active tickets.</p>
                    </div>
                  ) : (
                    <div className="orders-list">
                  {supportTickets.map((ticket) => {
                    const tid = ticket.ticketId || ticket.ticketNumber || ticket.id || '';
                    const issueType = ticket.issueType || ticket.type || '';
                    const statusVal = ticket.ticketStatus || ticket.Ticket_Status || ticket.status || 'UNDER REVIEW';
                    const descTxt = ticket.description || ticket.desc || "Our agents are currently reviewing your request.";
                    const totalVal = ticket.total || null;

                    return (
                      <div key={tid} className="orders-card-premium">
                        <div className="order-flex-between items-start">
                          <div>
                            <h3 className="font-bold text-lg leading-tight" style={{ color: '#1e293b' }}>
                              {issueType ? (ticket.restaurantName || issueType) : `Issue with ${ticket.restaurantName}`}
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">
                              CASE-{String(tid).replace('CASE-', '').replace('ORD-', '')}
                            </p>
                          </div>
                          {totalVal && <span className="font-bold text-primary">${typeof totalVal === 'number' ? totalVal.toFixed(2) : totalVal}</span>}
                        </div>
                        <div className="status-pill status-orange">
                          <span className="material-symbols-outlined text-14">support_agent</span>
                          {statusVal}
                        </div>
                        <p className="text-sm mt-3 text-slate-600 border-t border-slate-100 pt-3">
                           {descTxt}
                        </p>
                      </div>
                    );
                  })}
                  
                  {refundProcessingOrders.map((order) => (
                    <div key={order.id} className="orders-card-premium">
                      <div className="order-flex-between items-start mb-4">
                        <div className="order-flex-row gap-4">
                          <div className="orders-pic-premium" style={{ backgroundImage: `url('${order.image}')` }} />
                          <div>
                            <h3 className="font-bold text-lg leading-tight" style={{ color: '#1e293b' }}>{order.restaurantName}</h3>
                            <p className="text-slate-500 text-xs mt-1">Order #{order.id} • {order.date}</p>
                            <div className="status-pill status-blue">
                              <span className="material-symbols-outlined text-14" style={{ animation: 'orders-spin 3s linear infinite' }}>sync</span>
                              Refund Processing
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-primary">${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span>
                      </div>

                      {order.ticket && (
                      <div className="ticket-timeline-premium">
                        <div className="ticket-timeline-header">
                          <span className="material-symbols-outlined">cloud_done</span>
                          <p className="ticket-timeline-title">Ticket Status (Salesforce Sync)</p>
                        </div>
                        
                        <div className="timeline-track">
                           <div className="timeline-line-premium" />
                           
                           <div className="timeline-step-premium">
                             <div className="timeline-dot-premium bg-green-500">
                               <span className="material-symbols-outlined text-white" style={{fontSize: '12px', fontWeight: 'bold'}}>check</span>
                             </div>
                             <p className="text-sm font-semibold" style={{ color: '#334155' }}>Issue Reported</p>
                             <p className="text-xs text-slate-500">{order.ticket.reportedAt || 'Today, 7:15 PM'}</p>
                           </div>
                           
                           <div className="timeline-step-premium">
                             <div className="timeline-dot-premium bg-primary">
                               <span className="material-symbols-outlined text-white" style={{fontSize: '12px', fontWeight: 'bold'}}>verified</span>
                             </div>
                             <p className="text-sm font-semibold" style={{ color: '#334155' }}>Approved for Refund</p>
                             <p className="text-xs text-slate-500">{order.ticket.approvedAt || 'Today, 8:45 PM'}</p>
                           </div>

                           <div className="timeline-step-premium opacity-50">
                             <div className="timeline-dot-premium bg-slate-100" style={{borderColor: '#f1f5f9'}}>
                               <span className="material-symbols-outlined text-slate-400" style={{fontSize: '12px'}}>account_balance_wallet</span>
                             </div>
                             <p className="text-sm font-semibold" style={{ color: '#64748b' }}>Funds Released</p>
                             <p className="text-xs text-slate-500">{order.ticket.releasedAt || 'Estimated 3-5 days'}</p>
                           </div>
                        </div>
                      </div>
                      )}
                    </div>
                  ))}
                </div>
                )}
              </div>

              <div className="orders-section mt-6">
                <h2 className="orders-title-premium mb-4">Past Tickets</h2>
                <div className="orders-list">
                  {mockPastTickets.map((tc, idx) => (
                    <div key={idx} className="orders-card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                      <div className="past-ticket-img" style={{ backgroundImage: `url('${tc.image}')` }} />
                      <div className="flex-1">
                        <div className="order-flex-between items-center">
                          <h3 className="font-bold text-sm" style={{ color: '#1e293b' }}>{tc.restaurantName}</h3>
                          <span className="text-xs font-bold text-slate-500">${tc.price.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case #{tc.id}</span>
                          <span className="past-ticket-status">{tc.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

            {/* PAST ORDERS SECTION (LIMIT 8) */}
            {activeTab === 'orders' && pastOrders.length > 0 && (
              <div className="orders-section mt-4">
                <h2 className="orders-title-premium">Recent Orders</h2>
                <div className="orders-list">
                  {pastOrders.map((order) => {
                    if (order.status === 'DELIVERED' || order.status === 'Delivered') {
                      return (
                        <div key={order.id} className="orders-card-premium">
                          <div className="order-flex-row gap-4">
                            <div className="orders-pic-premium" style={{ backgroundImage: `url('${order.image}')` }} />
                            <div className="flex-1">
                              <div className="order-flex-between items-start">
                                <h3 className="font-bold text-lg leading-tight" style={{ color: '#1e293b' }}>{order.restaurantName}</h3>
                                <span className="text-sm font-bold" style={{ color: '#0f172a' }}>${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span>
                              </div>
                              <p className="text-slate-500 text-xs mt-1">{order.date}</p>
                              
                              <div className="status-pill status-slate">
                                <span className="material-symbols-outlined filled-icon">check_circle</span>
                                Delivered
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <button className="btn-reorder-premium">Reorder</button>
                            <button className="btn-raise-premium" onClick={() => { mediumTap(); navigate('/support'); }}>Raise Issue</button>
                          </div>
                        </div>
                      );
                    }
                    if (order.status === 'REFUNDED') {
                      return (
                        <div key={order.id} className="orders-card-premium">
                          <div className="order-flex-row gap-4">
                            <div className="orders-pic-premium" style={{ backgroundImage: `url('${order.image}')` }} />
                            <div className="flex-1">
                              <div className="order-flex-between items-start">
                                <h3 className="font-bold text-lg leading-tight" style={{ color: '#1e293b' }}>{order.restaurantName}</h3>
                                <span className="text-sm font-bold line-through text-slate-400">${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span>
                              </div>
                              <p className="text-slate-500 text-xs mt-1">{order.date}</p>
                              
                              <div className="status-pill status-slate">
                                <span className="material-symbols-outlined">check_circle</span>
                                Refunded
                              </div>
                            </div>
                          </div>
                          <button className="btn-summary-premium">
                            <span className="material-symbols-outlined text-14">receipt_long</span>
                            View Summary
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {activeTab === 'orders' && activeOrders.length === 0 && pastOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                 <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '1rem' }}>receipt_long</span>
                 <p style={{ fontWeight: 600 }}>No orders found.</p>
              </div>
            )}
          </div>
        )}
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
          <Link to="/orders" className="home-nav-item active" onClick={lightTap}>
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

export default Orders;

