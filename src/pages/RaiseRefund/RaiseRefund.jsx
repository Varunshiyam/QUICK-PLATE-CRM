import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStoredUser } from '../../services/firebase';
import useHaptic from '../../hooks/useHaptic';
import './RaiseRefund.css';

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
          date: o.date,
          image: o.image,
          total: typeof o.total === 'number' ? o.total.toFixed(2) : o.total
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

const RaiseRefund = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap, success } = useHaptic();
  
  const [recentOrders] = useState(getInitialOrders);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orderId: recentOrders.length > 0 ? recentOrders[0].id : '',
    contactNumber: '+1 (555) 000-1234',
    contactEmail: 'alex.walker@example.com',
    reason: 'Order Item Missing',
    description: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    lightTap();
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    success();
    setIsSubmitting(true);
    
    const selectedOrder = recentOrders.find(o => o.id === formData.orderId);
    const desc = `${formData.reason} - ${formData.description || 'Refund requested for order'}`;
    
    const caseId = `CASE-${Math.floor(Math.random() * 90000) + 10000}`;
    
    try {
      if (!isMockMode) {
        const storedUser = getStoredUser() || {};
        const payload = {
          customerId: storedUser.customerId,
          orderId: selectedOrder?.id,
          type: 'Refund Request',
          description: desc,
          restaurantName: selectedOrder?.name,
          reason: formData.reason,
          caseId: caseId
        };
        
        await axios.post(`${API_BASE_URL}/services/apexrest/case/create`, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        });
      } else {
        await new Promise(r => setTimeout(r, 600)); // mock delay
      }
    } catch (err) {
      console.warn("Backend ticket creation failed or timed out", err);
    } finally {
      setIsSubmitting(false);
      // Save to local storage to mock backend & UI
      const newTicket = {
        ticketId: caseId,
        ticketNumber: caseId,
        issueType: 'Refund Request: ' + (selectedOrder ? selectedOrder.name : `Order #${formData.orderId}`),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        ticketStatus: 'NEW',
        description: desc
      };
      
      const existing = JSON.parse(localStorage.getItem('supportTickets') || '[]');
      localStorage.setItem('supportTickets', JSON.stringify([newTicket, ...existing]));

      // Navigate back to support
      navigate('/support');
    }
  };

  return (
    <div className="rr-container dark-theme-compatible">
      {/* Top App Bar */}
      <header className="rr-header">
        <button className="rr-back-btn" onClick={handleBack}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="rr-title">Raise Refund Ticket</h1>
      </header>

      <main className="rr-main">
        {/* Branding Header */}
        <div className="rr-branding">
          <div className="rr-branding-logo">
            <span className="material-symbols-outlined rr-brand-icon">receipt_long</span>
            <span className="rr-brand-name">QUICK PLATE</span>
          </div>
          <p className="rr-brand-subtitle">Professional Support Powered by Salesforce</p>
        </div>

        {/* Form Container */}
        <form className="rr-form" onSubmit={handleSubmit}>
          {/* Select Order */}
          <div className="rr-form-group">
            <label className="rr-label">Select Order</label>
            <div className="rr-input-wrapper">
              <select 
                name="orderId" 
                className="rr-input rr-select" 
                value={formData.orderId}
                onChange={handleChange}
              >
                {recentOrders.length === 0 ? (
                  <option value="">No recent orders available</option>
                ) : (
                  recentOrders.map(order => (
                    <option key={order.id} value={order.id}>
                      {order.name} - {order.date} (${order.total})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="rr-grid">
            <div className="rr-form-group">
              <label className="rr-label">Contact Number</label>
              <input 
                type="tel" 
                name="contactNumber"
                className="rr-input" 
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
            <div className="rr-form-group">
              <label className="rr-label">Contact Email</label>
              <input 
                type="email" 
                name="contactEmail"
                className="rr-input" 
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Reason for Refund */}
          <div className="rr-form-group">
            <label className="rr-label">Reason for Refund</label>
            <div className="rr-input-wrapper">
              <select 
                name="reason" 
                className="rr-input rr-select" 
                value={formData.reason}
                onChange={handleChange}
              >
                <option value="Order Item Missing">Order Item Missing</option>
                <option value="Quality Issue">Quality Issue</option>
                <option value="Quantity Issue">Quantity Issue</option>
                <option value="Package Damaged">Package Damaged</option>
                <option value="Late Delivery">Late Delivery</option>
              </select>
            </div>
          </div>

          {/* Issue Description */}
          <div className="rr-form-group">
            <label className="rr-label">Description of Issue</label>
            <textarea 
              className="rr-input rr-textarea" 
              name="description"
              placeholder="Tell us what happened with your order..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Evidence Upload Section */}
          <div className="rr-form-group">
            <label className="rr-label">Evidence Upload</label>
            <div className="rr-upload-zone">
              <div className="rr-upload-icons">
                <div className="rr-upload-icon-wrapper">
                  <div className="rr-upload-icon-circle">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                  <span className="rr-upload-icon-label">Camera</span>
                </div>
                <div className="rr-upload-icon-wrapper">
                  <div className="rr-upload-icon-circle">
                    <span className="material-symbols-outlined">image</span>
                  </div>
                  <span className="rr-upload-icon-label">Gallery</span>
                </div>
                <div className="rr-upload-icon-wrapper">
                  <div className="rr-upload-icon-circle">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                  <span className="rr-upload-icon-label">Files</span>
                </div>
              </div>
              <p className="rr-upload-text">Drag and drop photos of the issue</p>
              <p className="rr-upload-subtext">Maximum file size: 10MB</p>
              <input type="file" className="rr-upload-input" />
            </div>
          </div>

          {/* Trust Badge */}
          <div className="rr-trust-badge">
            <span className="material-symbols-outlined rr-trust-icon">verified_user</span>
            <span className="rr-trust-text">Secure Salesforce Integration</span>
          </div>
        </form>
      </main>

      {/* Footer Button Area */}
      <footer className="rr-footer">
        <button className="rr-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
          <span>{isSubmitting ? 'Submitting...' : 'Submit Refund Ticket'}</span>
          {!isSubmitting && <span className="material-symbols-outlined">send</span>}
        </button>
        {/* iOS Home Indicator Spacing */}
        <div className="rr-ios-spacer"></div>
      </footer>
    </div>
  );
};

export default RaiseRefund;
