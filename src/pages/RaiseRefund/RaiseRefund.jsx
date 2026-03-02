import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import './RaiseRefund.css';

const RaiseRefund = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap, success } = useHaptic();
  
  const [formData, setFormData] = useState({
    orderId: '12345',
    contactNumber: '+1 (555) 000-1234',
    contactEmail: 'alex.walker@example.com',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    success();
    
    // Save to local storage to mock backend
    const newTicket = {
      id: `CASE-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'Raise Refund',
      restaurantName: `Order #${formData.orderId}`,
      date: new Date().toISOString(),
      status: 'UNDER REVIEW',
      desc: formData.description || 'Refund requested for order',
      total: formData.orderId === '12345' ? 42.50 : formData.orderId === '12344' ? 18.20 : 35.00
    };
    
    const existing = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    localStorage.setItem('supportTickets', JSON.stringify([newTicket, ...existing]));

    // Navigate back to support
    navigate('/support');
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
                <option value="12345">Order #12345 - Oct 24, 2023 ($42.50)</option>
                <option value="12344">Order #12344 - Oct 20, 2023 ($18.20)</option>
                <option value="12343">Order #12343 - Oct 15, 2023 ($35.00)</option>
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
        <button className="rr-submit-btn" onClick={handleSubmit}>
          <span>Submit Refund Ticket</span>
          <span className="material-symbols-outlined">send</span>
        </button>
        {/* iOS Home Indicator Spacing */}
        <div className="rr-ios-spacer"></div>
      </footer>
    </div>
  );
};

export default RaiseRefund;
