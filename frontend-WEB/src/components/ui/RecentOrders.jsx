import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RecentOrders
 * Reads from localStorage('quickplate_orders') — populated by Orders.jsx on load.
 * Shows last 3 delivered/refunded orders with a "Reorder" CTA.
 * Placed on the Home dashboard between Trending and Premium Selections.
 */
const RecentOrders = ({ onHaptic }) => {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('quickplate_orders') || '[]');
      const past = stored
        .filter(o =>
          ['DELIVERED', 'Delivered', 'REFUNDED'].includes(o.status)
        )
        .slice(0, 3);
      setRecentOrders(past);
    } catch {
      setRecentOrders([]);
    }
  }, []);

  if (recentOrders.length === 0) return null;

  return (
    <section className="home-recent-orders">
      <div className="home-section-header">
        <h2 className="home-section-title">Recently Ordered</h2>
        <button
          className="home-section-action"
          onClick={() => { onHaptic?.(); navigate('/orders'); }}
        >
          See all <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <div className="home-recent-scroll">
        {recentOrders.map((order) => (
          <div key={order.id} className="home-recent-card">
            <div
              className="home-recent-img"
              style={{ backgroundImage: `url('${order.image}')` }}
            />
            <div className="home-recent-info">
              <p className="home-recent-name">{order.restaurantName}</p>
              <p className="home-recent-meta">
                ₹{typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                &nbsp;•&nbsp;
                {order.status === 'REFUNDED' ? 'Refunded' : 'Delivered'}
              </p>
            </div>
            {order.status !== 'REFUNDED' && (
              <button
                className="home-recent-reorder-btn"
                onClick={() => { onHaptic?.(); navigate('/restaurant'); }}
              >
                Reorder
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentOrders;