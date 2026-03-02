import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import './PaymentIssue.css';

const PaymentIssue = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();
  
  const [selectedIssue, setSelectedIssue] = useState('double_charged');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    mediumTap();
    
    // Save to local storage to mock backend
    const selectedIssueData = issues.find(i => i.id === selectedIssue);
    const newTicket = {
      id: `CASE-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'Payment Issue',
      restaurantName: 'The Burger Joint',
      date: new Date().toISOString(),
      status: 'UNDER REVIEW',
      desc: selectedIssueData ? `${selectedIssueData.title}` : 'Payment problem reported',
      total: 42.50
    };
    
    const existing = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    localStorage.setItem('supportTickets', JSON.stringify([newTicket, ...existing]));

    // Navigate back to support page
    navigate('/support');
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
      id: 'payment_failed',
      title: 'Payment Failed but Amount Deducted',
      description: 'The app showed an error but money was taken'
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
      </div>

      <div className="payment-issue-content">
        <div className="support-ticket-header-small">
           <span className="support-ticket-text">SUPPORT TICKET #2941</span>
           <div className="support-ticket-divider"></div>
        </div>

        {/* Order Selection Card */}
        <h3 className="section-heading">Order Selection</h3>
        <div className="order-selection-card">
          <div className="order-selection-info">
             <div>
                <p className="order-selection-name">The Burger Joint</p>
                <p className="order-selection-id">Order #QP-984210</p>
             </div>
             <p className="order-selection-price">$42.50 • Oct 24, 2023</p>
          </div>
          <div className="order-selection-image" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAC551V4q37pQ0WPnckhW2McHWbsjtrOq5cwiyVz7OfBSzPjeYqg8Ve6pGP0yE2UhN5sFuwRrxQRh-ZlM22se1bNFpMNGKIBJ7ptQvhyG6-W9daWqvmJajJWaOb7iLdx-WAawTUewsoEhsChQQvFO2QuINFaiTT6-oaki7P5LJlKBTI7VAVQc9sLN_cr7YvE8l97MLSMjoBT-WcrbcSUEkLjqSWQ5kCqGwb-7ohhb2QPNImdObl_RBwGFschQ1hBHy3BZtzeDBoYCBw")`}}></div>
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
           <button className="submit-query-btn" onClick={handleSubmit}>
              <span>Submit Payment Query</span>
              <span className="material-symbols-outlined">send</span>
           </button>
           <p className="powered-by-text">Powered by Salesforce Service Cloud</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentIssue;
