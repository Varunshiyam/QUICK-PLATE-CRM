import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useHaptic from '../../hooks/useHaptic';
import '../Home/Home.css';
import './Orders.css';

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

const Orders = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Past Orders'); // Past Orders | Support Tickets

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isMockMode) {
          await new Promise(r => setTimeout(r, 600));
          setOrders(MOCK_ORDERS);
        } else {
          try {
            const res = await axios.get(`${API_BASE_URL}/orders`);
            if (res.data && res.data.length > 0) {
              const mappedData = res.data.map(item => ({
                id: item.Id || item.id || 'N/A',
                restaurantName: item.Restaurant_Name__c || item.restaurantName || 'Quick Plate Order',
                date: item.CreatedDate ? new Date(item.CreatedDate).toLocaleDateString() : item.date || 'Today',
                total: item.Total_Amount__c || item.total || 0,
                status: item.Order_Status__c || item.status || 'PLACED',
                paymentStatus: item.Payment_Status__c || item.paymentStatus || '',
                image: item.image || MOCK_ORDERS[0].image
              }));
              setOrders(mappedData);
            } else {
              setOrders([]);
            }
          } catch(e) {
            console.warn("Backend fetch failed", e);
            setOrders([]);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleTrackOrder = (orderId) => {
    mediumTap();
    navigate(`/tracking/${orderId}`);
  };

  return (
    <div className="orders-layout">
      {/* ─── Header ─── */}
      <header className="orders-header">
        <div className="orders-header-left">
          <button className="orders-back-btn" onClick={() => { lightTap(); navigate(-1); }}>
            <span className="material-symbols-outlined text-primary">arrow_back_ios</span>
          </button>
          <h1 className="orders-h1">My Orders</h1>
        </div>
        <button className="orders-search-btn" onClick={lightTap}>
          <span className="material-symbols-outlined text-primary">search</span>
        </button>
      </header>

      {/* ─── Tabs ─── */}
      <div className="orders-tabs">
        <div className="orders-tabs-container">
          <button 
            className={`orders-tab ${activeTab === 'Past Orders' ? 'active' : ''}`}
            onClick={() => { lightTap(); setActiveTab('Past Orders'); }}
          >
            Past Orders
          </button>
          <button 
            className={`orders-tab ${activeTab === 'Support Tickets' ? 'active' : ''}`}
            onClick={() => { lightTap(); setActiveTab('Support Tickets'); }}
          >
            Support Tickets
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="orders-main">
        {loading ? (
          <div className="orders-loading">
            <div className="orders-spinner" />
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              
              /* Active Order State (e.g. Payment Succeeded / Placed / On the Way) */
              if (order.status === 'ON_THE_WAY' || order.status === 'PLACED' || order.status === 'Payment Succeeded' || order.paymentStatus === 'Payment Succeeded') {
                return (
                  <div key={order.id} className="order-card p-4">
                    <div className="order-flex-row gap-4">
                      <div className="order-img-lg" style={{ backgroundImage: `url('${order.image}')` }} />
                      <div className="flex-1">
                        <div className="order-flex-between items-start">
                          <h3 className="font-bold">{order.restaurantName}</h3>
                          <span className="text-sm font-bold">${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Order #{order.id} • {order.date}</p>
                        
                        <div className="mt-2 inline-flex items-center gap-1_5 px-2_5 py-0_5 rounded-full bg-green-100 text-green-700 text-10 font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-14 filled-icon">moped</span>
                          {order.status === 'Payment Succeeded' || order.paymentStatus === 'Payment Succeeded' ? 'Payment Succeeded' : 'On the way'}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button 
                             className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded shadow-sm"
                             onClick={() => handleTrackOrder(order.id)}
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              /* Refund Processing Ticket */
              if (order.status === 'REFUND_PROCESSING' || order.status === 'Refund Processing') {
                return (
                  <div key={order.id} className="order-card p-5">
                    <div className="order-flex-between items-start mb-4">
                      <div className="order-flex-row gap-4">
                        <div className="order-img-md" style={{ backgroundImage: `url('${order.image}')` }} />
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{order.restaurantName}</h3>
                          <p className="text-slate-500 text-xs">{order.date}</p>
                          <div className="mt-2 inline-flex items-center gap-1_5 px-2_5 py-0_5 rounded-full bg-blue-100 text-blue-700 text-10 font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-14">autorenew</span>
                            Refund Processing
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-primary">${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span>
                    </div>

                    {order.ticket && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-11 font-bold text-slate-400 uppercase tracking-widest mb-3">Ticket Status (Salesforce Sync)</p>
                      
                      <div className="ticket-timeline">
                         <div className="ticket-axis" />
                         
                         <div className="ticket-point">
                           <div className="ticket-dot bg-green-500" />
                           <p className="text-sm font-semibold">Issue Reported</p>
                           <p className="text-xs text-slate-500">{order.ticket.reportedAt}</p>
                         </div>
                         
                         <div className="ticket-point">
                           <div className="ticket-dot bg-primary" />
                           <p className="text-sm font-semibold">Approved for Refund</p>
                           <p className="text-xs text-slate-500">{order.ticket.approvedAt}</p>
                         </div>

                         <div className="ticket-point opacity-40">
                           <div className="ticket-dot bg-slate-300" />
                           <p className="text-sm font-semibold">Funds Released</p>
                           <p className="text-xs text-slate-500">{order.ticket.releasedAt}</p>
                         </div>
                      </div>
                    </div>
                    )}
                  </div>
                );
              }

              /* Standard Delivered Order */
              if (order.status === 'DELIVERED' || order.status === 'Delivered') {
                return (
                  <div key={order.id} className="order-card p-4">
                    <div className="order-flex-row gap-4">
                      <div className="order-img-lg" style={{ backgroundImage: `url('${order.image}')` }} />
                      <div className="flex-1">
                        <div className="order-flex-between items-start">
                          <h3 className="font-bold">{order.restaurantName}</h3>
                          <span className="text-sm font-bold">${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1">{order.date}</p>
                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded shadow-sm">Reorder</button>
                          <button className="flex-1 border border-primary text-primary text-xs font-bold py-2 rounded">Raise Issue</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              /* Refunded Order */
              if (order.status === 'REFUNDED') {
                return (
                  <div key={order.id} className="order-card p-4">
                    <div className="order-flex-row gap-4">
                      <div className="order-img-lg" style={{ backgroundImage: `url('${order.image}')` }} />
                      <div className="flex-1">
                        <div className="order-flex-between items-start">
                          <h3 className="font-bold">{order.restaurantName}</h3>
                          <span className="text-sm font-bold line-through text-slate-400">${order.total.toFixed(2)}</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1">{order.date}</p>
                        
                        <div className="mt-2 inline-flex items-center gap-1_5 px-2 py-0_5 rounded-full bg-slate-100 text-slate-600 text-10 font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-14">check_circle</span>
                          Refunded
                        </div>
                        
                        <button className="mt-3 w-full border border-slate-200 text-slate-500 text-xs font-bold py-2 rounded flex items-center justify-center gap-2">
                           <span className="material-symbols-outlined text-14">receipt_long</span>
                           View Summary
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
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
