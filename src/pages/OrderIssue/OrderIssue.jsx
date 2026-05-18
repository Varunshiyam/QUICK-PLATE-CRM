import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStoredUser } from '../../services/firebase';
import useHaptic from '../../hooks/useHaptic';
import './OrderIssue.css';

const MOCK_ORDERS = [
  {
    id: 1,
    name: "The Golden Grill",
    meta: "Delivered • Oct 24, 6:42 PM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj3rjCuxuKAjOt2S7GA5ipqT2I_2D2b1JsQho6u71VfImWloa4OH8PfWidGuELcmFPD5JoSpiU5gXzNkkJxHGncu7YpRZMvpQfeTosnWcdP3rw43VbVVVV3Xt_C7A48jBl4fnNiQQULHAwDPughlE7j9CBGhiQnkmoP69hzIcPbTDP_Xxox0sTmrK6SyVMQa3NJh1JZLj2SSZsVcVBMuw-nDKnExpCE-5RFPfi7ds8PmHGB9Y80MRP5_8pINiuJTS_azu-ifmSJe1V"
  },
  {
    id: 2,
    name: "Sushi Zen",
    meta: "Delivered • Oct 22, 8:15 PM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBELMF363gYZKyMfKtque54A1aehW215zV0n7WhrTKeg68baqlTAQUQng0lbpIpzS7ktEOEg3cnY3NjZS1lPEoTAKLhyI4Ktf1m0rDXH-MAzjKZ8QGRLV7GGqm-9Zn_2s3ETEHYme_gVifawN_wh7ItUZIlQ91hu1Szqhe7UTicrkw53amojzn8TMd9S2xet1hfZOv2RsiMtKyPOFFRD5uVhm3y8-2jDwbFxsp4q9aOYykqohEnd996y0bcaxgE79yk8AcQv4lL0a3A"
  },
  {
    id: 3,
    name: "Pizzeria Roma",
    meta: "Delivered • Oct 21, 1:20 PM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmwCD6HnXQG82erJve591MlNZUFR9q06jvVMgx9btk1_AN5ChEzcod_hCRZ2VHjmz4j5bHFVsW6FuuPRsCRNhOCwtFmMWHz61_DskkRKc39WshhaTYZ3o2UCTieMrgmb3UNyMuCE0EJ2y4Cwhsh5zV05IzvI_ZutUz8K082EylfcrdmAt_ho7Zmy83qzM3oTDJ8He5YlsDN0MSc9oxhcJKS2q5ZmcXePnt-SXN3bKKKenT1ajmY9SjeHSBZRaXwAkrtwvV3gzzsyp9"
  }
];

const ISSUE_CATEGORIES = [
  { id: 'order_not_placed', icon: 'pending_actions', title: 'Order Not Placed', desc: 'Order was placed but not confirmed' },
  { id: 'no_delivery_agent', icon: 'person_off', title: 'No Delivery Agent Assigned', desc: 'No one picked up the order' },
  { id: 'mistakenly_ordered', icon: 'error_outline', title: 'Mistakenly Ordered', desc: 'Accidental order placement' },
  { id: 'missing_items', icon: 'inventory_2', title: 'Missing Items', desc: 'Items were left out of the bag' },
  { id: 'wrong_order', icon: 'swap_horiz', title: 'Wrong Order', desc: "Received someone else's meal" },
  { id: 'bugs_order_page', icon: 'bug_report', title: 'Bugs in Order Page', desc: 'Encountered technical issues' },
];

const getInitialOrders = () => {
  try {
    const stored = localStorage.getItem('quickplate_orders');
    if (stored) {
      const parsed = JSON.parse(stored);
      const past = parsed.filter(order => order.status === 'DELIVERED' || order.status === 'Delivered' || order.status === 'REFUNDED').slice(0, 8);
      if (past.length > 0) {
        return past.map(o => ({
          id: o.id,
          name: o.restaurantName,
          meta: `${o.status === 'REFUNDED' || o.status === 'Refunded' ? 'Refunded' : 'Delivered'} • ${o.date}`,
          image: o.image
        }));
      }
    }
  } catch (e) {
    console.warn("Failed to parse orders from localStorage", e);
  }
  return [];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';
const isMockMode = !API_BASE_URL;

const OrderIssue = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();
  
  const [recentOrders] = useState(getInitialOrders);
  const [selectedOrder, setSelectedOrder] = useState(recentOrders[0]);
  const [selectedIssue, setSelectedIssue] = useState('order_not_placed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    lightTap();
    navigate(-1);
  };

  const handleOrderSelect = (order) => {
    lightTap();
    setSelectedOrder(order);
  };

  const handleIssueSelect = (issueId) => {
    lightTap();
    setSelectedIssue(issueId);
  };

  const handleSubmit = async () => {
    mediumTap();
    setIsSubmitting(true);
    
    const selectedIssueData = ISSUE_CATEGORIES.find(i => i.id === selectedIssue);
    const desc = selectedIssueData ? `${selectedIssueData.title} reported` : 'Issue reported with order';
    
    const caseId = `CASE-${Math.floor(Math.random() * 90000) + 10000}`;
    
    try {
      if (!isMockMode) {
        const storedUser = getStoredUser() || {};
        const payload = {
          customerId: storedUser.customerId,
          orderId: selectedOrder?.id,
          type: 'Order Issue',
          description: desc,
          restaurantName: selectedOrder?.name,
          reason: selectedIssueData?.title,
          caseId: caseId
        };
        
        await axios.post(`${API_BASE_URL}/services/apexrest/case/create`, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        });
      } else {
        await new Promise(r => setTimeout(r, 600)); // mock delay
      }
    } catch (e) {
      console.warn("Backend ticket creation failed or timed out", e);
    } finally {
      setIsSubmitting(false);
      // Save to local storage to mock backend & UI
      const newTicket = {
        ticketId: caseId,
        ticketNumber: caseId,
        issueType: 'Order Issue: ' + (selectedOrder?.name || 'Quick Plate Order'),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        ticketStatus: 'NEW',
        description: desc
      };
      
      const existing = JSON.parse(localStorage.getItem('supportTickets') || '[]');
      localStorage.setItem('supportTickets', JSON.stringify([newTicket, ...existing]));

      navigate('/support');
    }
  };

  return (
    <div className="order-issue-container">
      <header className="order-issue-header">
        <button className="order-issue-back-btn" onClick={handleBack}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="order-issue-title">Order Issue</h1>
        <div className="w-10"></div>
      </header>
      
      <main className="order-issue-main">
        <section className="order-issue-section">
          <div className="order-issue-step-wrap mb-4">
            <div className="" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
              <h3 className="section-heading">
                Select Recent Order
              </h3>
              <span 
                className=""
                style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f97f1a', cursor: 'pointer' }}
              >View All</span>
            </div>
          </div>
          
          <div className="order-issue-orders-scroll">
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', width: '100%' }}>
                 <p style={{ fontWeight: 600 }}>No recent orders to report issues for.</p>
              </div>
            ) : (
              recentOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <button 
                    key={order.id}
                    className={`order-issue-order-card ${isSelected ? 'selected' : ''}`} 
                    onClick={() => handleOrderSelect(order)}
                  >
                    <div className="order-issue-order-img-wrap">
                      <img 
                        alt={order.name} 
                        className="order-issue-order-img" 
                        src={order.image} 
                      />
                      {isSelected && (
                        <div className="order-issue-check-badge">
                          <span className="material-symbols-outlined">check</span>
                        </div>
                      )}
                    </div>
                    <h4 className={`order-issue-order-name ${!isSelected ? 'text-slate-600 dark:text-zinc-400' : ''}`}>
                      {order.name}
                    </h4>
                    <p className="order-issue-order-meta">{order.meta}</p>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <div className="order-issue-step-wrap mt-8 mb-6">
          <h2 
            className=""
            style={{color: '#0f172a', fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'}}
          >
            Reporting Issue for {selectedOrder?.name}
          </h2>
          <p 
            className=""
            style={{fontSize: '15px', color: '#94a3b8'}}
          >
            Please select the category that best describes the problem with this specific order.
          </p>
        </div>

        <div className="order-issue-categories">
          {ISSUE_CATEGORIES.map((issue) => {
            const isSelected = selectedIssue === issue.id;
            return (
              <button 
                key={issue.id}
                className={`order-issue-category-card ${isSelected ? 'selected' : ''}`} 
                onClick={() => handleIssueSelect(issue.id)}
              >
                <div className={`order-issue-category-icon-wrap ${isSelected ? 'selected' : ''}`}>
                  <span className="material-symbols-outlined">{issue.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{issue.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">{issue.desc}</p>
                </div>
                {isSelected ? (
                  <div className="order-issue-selected-badge shadow-sm">
                    <span className="material-symbols-outlined text-[10px] block font-bold">check</span>
                  </div>
                ) : (
                  <span className="material-symbols-outlined text-slate-300 dark:text-zinc-700">chevron_right</span>
                )}
              </button>
            );
          })}
        </div>
      </main>

      <div className="order-issue-footer">
        <button className="order-issue-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Continue'}
          {!isSubmitting && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
        </button>
        <p className="order-issue-footer-text">Powered by Salesforce Service Cloud</p>
      </div>
    </div>
  );
};

export default OrderIssue;
