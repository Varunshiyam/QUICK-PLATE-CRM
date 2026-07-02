import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStoredUser } from '../../services/firebase';
import useHaptic from '../../hooks/useHaptic';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import './PaymentIssue.css';
import '../OrderIssue/OrderIssue.css'; // For order selection slider styles

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
          image: o.image,
          total: o.total
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

const PaymentIssue = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();
  
  const [recentOrders] = useState(getInitialOrders);
  const [selectedOrder, setSelectedOrder] = useState(recentOrders[0]);
  const [selectedIssue, setSelectedIssue] = useState('double_charged');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    mediumTap();
    setIsSubmitting(true);
    
    // Save to local storage to mock backend
    const selectedIssueData = issues.find(i => i.id === selectedIssue);
    const desc = selectedIssueData ? `${selectedIssueData.title}` : 'Payment problem reported';
    
    const caseId = `CASE-${Math.floor(Math.random() * 90000) + 10000}`;
    
    try {
      if (!isMockMode) {
        const storedUser = getStoredUser() || {};
        const payload = {
          idToken: storedUser.firebaseIdToken,
          orderId: selectedOrder?.id,
          type: 'Payment Issue',
          description: desc,
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
      const newTicket = {
        ticketId: caseId,
        ticketNumber: caseId,
        issueType: 'Payment Issue: ' + (selectedOrder?.name || 'Quick Plate Order'),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        ticketStatus: 'NEW',
        description: desc
      };
      
      const existing = JSON.parse(localStorage.getItem('supportTickets') || '[]');
      localStorage.setItem('supportTickets', JSON.stringify([newTicket, ...existing]));

      // Navigate back to support page
      navigate('/support');
    }
  };

  const issues = [
    {
      id: 'double_charged',
      title: 'Double Charged',
      description: 'I see two identical transactions for this order'
    },
    {
      id: 'refund_not_received',
      title: 'Refund Not Received',
      description: 'My cancellation refund hasn\'t arrived yet'
    },
    {
      id: 'payment_failed_amount_deducted',
      title: 'Payment Failed But Amount Deducted',
      description: 'The app showed an error but money was taken'
    },
    {
      id: 'over_than_mrp',
      title: 'Over Than MRP Price',
      description: 'Charged more than the listed price'
    },
    {
      id: 'payment_failed',
      title: 'Payment Failed',
      description: 'Transaction was unsuccessful'
    }
  ];

  return (
    <div className="payment-issue-container">
      {/* Top Navigation */}
      <div className="payment-issue-header">
        <div className="payment-issue-back" onClick={() => { lightTap(); navigate(-1); }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="payment-issue-title">Report Payment Issue</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <ThemeToggle />
        </div>
      </div>

      <div className="payment-issue-content">
        <div className="support-ticket-header-small">
           <span className="support-ticket-text">SUPPORT TICKET #2941</span>
           <div className="support-ticket-divider"></div>
        </div>

        {/* Order Selection Card */}
        <div className="order-issue-step-wrap mb-4 px-0">
          <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 className="section-heading" style={{ marginBottom: 0 }}>Select Recent Order</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f97f1a', cursor: 'pointer' }}>View All</span>
          </div>
        </div>
        
        <div className="order-issue-orders-scroll" style={{ padding: '0 0 1rem 0' }}>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', width: '100%', border: '1px border #e2e8f0', borderRadius: '0.75rem' }}>
               <p style={{ fontWeight: 600 }}>No recent orders to report issues for.</p>
            </div>
          ) : (
            recentOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <button 
                  key={order.id}
                  className={`order-issue-order-card ${isSelected ? 'selected' : ''}`} 
                  onClick={() => { lightTap(); setSelectedOrder(order); }}
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

        {/* Payment Problem Category Selector */}
        <h3 className="section-heading">Payment Problem Category</h3>
        <div className="issue-category-list">
           {issues.map(issue => (
             <label 
               key={issue.id} 
               className={`issue-category-label ${selectedIssue === issue.id ? 'selected' : ''}`}
               onClick={() => { lightTap(); setSelectedIssue(issue.id); }}
             >
               <input 
                 type="radio"
                 name="payment-issue"
                 className="issue-category-radio"
                 checked={selectedIssue === issue.id}
                 onChange={() => setSelectedIssue(issue.id)}
               />
               <div className="issue-category-text">
                 <p className="issue-category-title">{issue.title}</p>
                 <p className="issue-category-desc">{issue.description}</p>
               </div>
             </label>
           ))}
        </div>

        {/* Upload Screenshot Section */}
        <h3 className="section-heading">Upload Screenshot</h3>
        <div className="upload-section">
           <div className="upload-dropzone" onClick={() => lightTap()}>
             <span className="material-symbols-outlined upload-icon">cloud_upload</span>
             <p className="upload-title">Bank Statement or Receipt</p>
             <p className="upload-desc">Maximum file size 5MB. Supports JPG, PNG or PDF.</p>
           </div>
        </div>

        {/* Additional Details */}
        <h3 className="section-heading">Additional Transaction Details</h3>
        <div className="additional-details-section">
           <textarea 
             className="additional-details-textarea"
             placeholder="Please provide any additional information that might help us resolve this issue faster..."
             value={additionalDetails}
             onChange={(e) => setAdditionalDetails(e.target.value)}
           ></textarea>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
           <button className="submit-query-btn" onClick={handleSubmit} disabled={isSubmitting}>
              <span>{isSubmitting ? 'Submitting...' : 'Submit Payment Query'}</span>
              {!isSubmitting && <span className="material-symbols-outlined">send</span>}
           </button>
           <p className="powered-by-text">Powered by Salesforce Service Cloud</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentIssue;
