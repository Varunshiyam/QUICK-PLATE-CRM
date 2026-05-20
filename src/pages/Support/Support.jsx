import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useHaptic from '../../hooks/useHaptic';
import '../Home/Home.css';
import './Support.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isMockMode = !API_BASE_URL;

/* -----------------------------
   Ticket Status Mapping
----------------------------- */

const getStatusTag = (status) => {

  const normalizedStatus = status || 'NEW';
  const map = {
    NEW: { label: "New", class: "status-new" },
    IN_PROGRESS: { label: "In Progress", class: "status-progress" },
    WAITING_FOR_CUSTOMER: { label: "Waiting For You", class: "status-waiting" },
    WAITING_FOR_INTERNAL_TEAM: { label: "Internal Review", class: "status-review" },
    RESOLVED: { label: "Resolved", class: "status-resolved" },
    CLOSED: { label: "Closed", class: "status-closed" }
  };

  return map[normalizedStatus] || { label: normalizedStatus, class: "status-default" };

};

const STATUS_SEQUENCE = [
  'NEW',
  'IN_PROGRESS',
  'WAITING_FOR_CUSTOMER',
  'WAITING_FOR_INTERNAL_TEAM',
  'RESOLVED',
  'CLOSED'
];

const STATUS_LABELS = {
  'NEW': 'Issue Reported',
  'IN_PROGRESS': 'In Progress',
  'WAITING_FOR_CUSTOMER': 'Waiting For Customer',
  'WAITING_FOR_INTERNAL_TEAM': 'Waiting For Internal Team',
  'RESOLVED': 'Resolved',
  'CLOSED': 'Closed'
};

const FAQ_DATA = [
  {
    q: 'How do I track my order?',
    a: 'Once your order is placed, go to Orders → select your order → tap "Track Order". You can follow the real-time status from restaurant to your door.'
  },
  {
    q: 'Can I cancel my order after placing it?',
    a: 'Orders can be cancelled within 2 minutes of placing them if the restaurant has not yet accepted. After acceptance, cancellation depends on the restaurant\'s policy.'
  },
  {
    q: 'Can I edit my order after placing it?',
    a: 'Unfortunately, orders cannot be edited once placed. You\'ll need to cancel (if still within the cancellation window) and place a new order with the correct items.'
  },
  {
    q: 'Can I change the delivery address or phone number after placing an order?',
    a: 'Address changes are not supported after an order is confirmed. Please ensure your delivery address is correct before placing the order. If you need help with your phone number, tap "Chat With Us" in Quick Actions above and our team will assist you.'
  },
  {
    q: 'Do you charge for delivery?',
    a: 'Delivery fees vary based on distance and restaurant. If your order value is above the restaurant\'s free-delivery threshold, delivery is free. Any applicable delivery fee is shown clearly on the Review Order screen before you pay.'
  },
  {
    q: 'Is there a minimum order value?',
    a: 'Minimum order values are set by individual restaurants and vary. The minimum (if any) is displayed on the restaurant\'s menu page before you add items to your cart.'
  },
  {
    q: 'Can I place a bulk or group order?',
    a: 'Yes! You can add large quantities of items from a single restaurant. For very large corporate or event orders, tap "Chat With Us" and our team will assist you personally.'
  },
  {
    q: 'Can I schedule an order in advance?',
    a: 'Scheduled ordering is coming soon on Quick Plate! For now, orders are placed for immediate delivery. Stay tuned for updates.'
  },
  {
    q: 'Will Quick Plate be accountable for food quality or quantity?',
    a: 'While restaurants are responsible for preparing your food, Quick Plate takes quality seriously. If your order is incorrect, missing items, or below quality standards, raise an Order Issue from Quick Actions above and we\'ll make it right.'
  },
  {
    q: 'How do I get an invoice for my order?',
    a: 'Order invoices are available in the Orders section. Open your completed order and tap "Download Invoice". The PDF is sent to your registered email as well.'
  },
  {
    q: 'What if my food arrived late or cold?',
    a: 'We\'re sorry! Raise an Order Issue from Quick Actions above. Our team reviews it within 24 hours and may offer a refund or credit.'
  },
  {
    q: 'Why was my payment declined?',
    a: 'This can happen due to insufficient balance, bank restrictions, or network issues. Try a different payment method or raise a Payment Issue above.'
  },
  {
    q: 'How do I contact a live agent?',
    a: 'Tap "Chat With Us" in Quick Actions above. Agents are available 9 AM – 11 PM daily. Outside hours, leave a message and we\'ll respond ASAP.'
  },
];

const Support = () => {

  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  /* -----------------------------
     Fetch Support Tickets
  ----------------------------- */

  useEffect(() => {

    const fetchTickets = async () => {

      try {

        if (isMockMode) {

          const userTickets =
            JSON.parse(localStorage.getItem('supportTickets') || '[]');

          setTickets(userTickets);

        } else {

          const storedUser =
            JSON.parse(localStorage.getItem('quickplate_user') || '{}');

          const res = await axios.get(
            `${API_BASE_URL}/services/apexrest/case/list?customerId=${storedUser.customerId}`
          );

          setTickets(res.data || []);

        }

      } catch (err) {

        console.error("Ticket fetch error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchTickets();

  }, []);

  /* -----------------------------
     Notifications
  ----------------------------- */

  const handleNotificationClick = () => {

    lightTap();

    if (tickets.length > 0) {

      toast.success(`You have ${tickets.length} active tickets`, {
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

  return (

    <div className="support-container">

      {/* Header */}

      <header className="support-header">

        <button
          className="support-back-btn"
          onClick={() => { lightTap(); navigate(-1); }}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>

        <h1 className="support-title">Support Center</h1>

        <div className="support-badge-container">

          <button
            className="support-icon-btn"
            onClick={handleNotificationClick}
          >
            <span className="material-symbols-outlined">notifications</span>
            {tickets.length > 0 && <span className="support-badge"></span>}
          </button>

        </div>

      </header>

      {/* Main */}

      <main className="support-main">

        {/* Hero */}

        <div className="support-hero">
          <h2>How can we help?</h2>
          <p>Track your support tickets or raise a new issue</p>
        </div>

        {/* Quick Actions */}

        <section className="support-section">

          <div className="support-section-header">
            <h3 className="support-section-title">Quick Actions</h3>
          </div>

          <div className="support-actions-grid">

            <button
              className="support-action-card"
              onClick={() => { lightTap(); navigate('/raise-refund'); }}
            >
              <span className="material-symbols-outlined">payments</span>
              <span>Raise Refund</span>
            </button>

            <button
              className="support-action-card"
              onClick={() => { lightTap(); navigate('/order-issue'); }}
            >
              <span className="material-symbols-outlined">package_2</span>
              <span>Order Issue</span>
            </button>

            <button
              className="support-action-card"
              onClick={() => { lightTap(); navigate('/payment-issue'); }}
            >
              <span className="material-symbols-outlined">credit_card</span>
              <span>Payment Issue</span>
            </button>

            <button className="support-action-card primary">
              <span className="material-symbols-outlined">headset_mic</span>
              <span>Chat With Us</span>
            </button>

          </div>

        </section>

        {/* Active Tickets */}

        <section className="support-section">

          <div className="support-section-header">

            <h3 className="support-section-title">
              Active Tickets
            </h3>

          </div>

          <div className="support-tickets-list">

            {loading ? (

              <div className="support-loading">
                Loading tickets...
              </div>

            ) : tickets.length > 0 ? (

              tickets.map(ticket => {
                
                // Securely extract and normalize backend status
                const rawStatus = ticket.ticketStatus || ticket.Ticket_Status || ticket.status || 'NEW';
                const formattedStatus = String(rawStatus).toUpperCase().replace(/\s+/g, '_');
                const validStatus = STATUS_SEQUENCE.includes(formattedStatus) ? formattedStatus : 'NEW';

                const statusTag =
                  getStatusTag(validStatus);

                return (

                  <div
                    className="support-ticket-card"
                    key={ticket.ticketId || ticket.id}
                  >
                    <div className="st-info-wrapper">
                       {ticket.image ? (
                          <img src={ticket.image} alt="Restaurant" className="st-restaurant-img" />
                       ) : (
                          <div className="st-icon-circle">
                            <span className="material-symbols-outlined">restaurant</span>
                          </div>
                       )}
                       <div className="st-details">
                         <div className="st-title-row">
                           <h4 className="st-title">{ticket.restaurantName || ticket.issueType}</h4>
                           {ticket.total && <span className="st-price">${Number(ticket.total).toFixed(2)}</span>}
                         </div>
                         <p className="st-meta">{ticket.ticketNumber || ticket.ticketId} • {ticket.createdAt || 'Recently'}</p>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                           <div className={`st-badge ${statusTag.class}`} style={{ margin: 0 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '12px', marginRight: '4px' }}>sync</span>
                              {statusTag.label.toUpperCase()}
                           </div>
                           {(ticket.Description || ticket.description) && (
                             <div style={{ fontSize: '12px', color: '#666', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px', background: '#f8f9fa', padding: '4px 8px', borderRadius: '4px' }}>
                               <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#ff7a00' }}>support_agent</span>
                               <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                 {ticket.Description || ticket.description}
                               </span>
                             </div>
                           )}
                         </div>
                       </div>
                    </div>

                    <div className="st-divider"></div>
                    <p className="st-timeline-title">TICKET STATUS (SALESFORCE SYNC)</p>

                    <div className="st-timeline">
                       {STATUS_SEQUENCE.map((statusKey, index) => {
                          const currentIndex = STATUS_SEQUENCE.indexOf(validStatus);
                          const isCompleted = index < currentIndex;
                          const isCurrent = index === currentIndex;
                          const isFuture = index > currentIndex;

                          return (
                            <div className="st-timeline-step" key={statusKey}>
                               <div className="st-timeline-indicator">
                                  <div className={`st-dot ${isCompleted ? 'completed' : isCurrent ? 'current' : 'future'}`}>
                                    {isCurrent && <div className="st-dot-glow"></div>}
                                  </div>
                                  {index < STATUS_SEQUENCE.length - 1 && (
                                    <div className={`st-line ${isCompleted ? 'completed' : 'future'}`}></div>
                                  )}
                               </div>
                               <div className="st-timeline-content">
                                  <h5 className={`st-step-title ${isFuture ? 'future' : ''}`}>
                                    {STATUS_LABELS[statusKey]}
                                  </h5>
                                  {isCurrent ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <p className="st-step-time" style={{ margin: 0 }}>{ticket.createdAt || 'Just now'}</p>
                                      {(ticket.Description || ticket.description) && (
                                        <p style={{ fontSize: '12px', color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#ff7a00' }}>chat</span>
                                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.Description || ticket.description}</span>
                                        </p>
                                      )}
                                    </div>
                                  ) : isCompleted ? (
                                    <p className="st-step-time">Completed</p>
                                  ) : (
                                    <p className="st-step-time">Pending</p>
                                  )}
                               </div>
                            </div>
                          )
                       })}
                    </div>
                  </div>

                );

              })

            ) : (

              <div className="support-empty">

                <span className="material-symbols-outlined">
                  assignment_turned_in
                </span>

                <p>No active tickets.</p>

              </div>

            )}

          </div>

        </section>

        {/* FAQ Section */}
        <section className="support-section">
          <div className="support-section-header">
            <h3 className="support-section-title">Frequently Asked Questions</h3>
          </div>

          <div className="faq-list">
            {FAQ_DATA.map((item, idx) => (
              <div
                key={idx}
                className={`faq-item${openFaq === idx ? ' open' : ''}`}
                onClick={() => { lightTap(); setOpenFaq(openFaq === idx ? null : idx); }}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className={`material-symbols-outlined faq-chevron${openFaq === idx ? ' rotated' : ''}`}>
                    expand_more
                  </span>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Bottom Navigation */}

      <nav className="home-bottom-nav">

        <div className="home-bottom-nav-inner">

          <Link
            to="/home"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>

          <Link
            to="/discover"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">explore</span>
            <span>Discover</span>
          </Link>

          <Link
            to="/orders"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">
              receipt_long
            </span>
            <span>Orders</span>
          </Link>

          <Link
            to="/profile"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </Link>

        </div>

      </nav>

    </div>

  );

};

export default Support;