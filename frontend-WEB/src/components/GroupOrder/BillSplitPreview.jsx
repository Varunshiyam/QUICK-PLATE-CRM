import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './BillSplitPreview.css';

const DELIVERY_FEE = 49;
const TAX_RATE = 0.05;

const SPLIT_MODES = [
  { id: 'equal', label: 'Equal split' },
  { id: 'itemised', label: 'By items' },
];

const STATUS_MAP = {
  pending: { className: 'bsp-status--pending', label: 'Pay now' },
  waiting: { className: 'bsp-status--waiting', label: 'Notified' },
  paid: { className: 'bsp-status--paid', label: 'Paid' },
};

function calculateShares(mode, cartItems, participants) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + tax;

  if (mode === 'equal') {
    const each = Math.round(total / participants.length);
    return Object.fromEntries(participants.map((p) => [p.id, each]));
  }

  const itemTotals = Object.fromEntries(participants.map((p) => [p.id, 0]));
  cartItems.forEach((item) => {
    itemTotals[item.participantId] =
      (itemTotals[item.participantId] || 0) + item.price * item.qty;
  });

  const overhead = DELIVERY_FEE + tax;
  return Object.fromEntries(
    participants.map((p) => {
      const items = itemTotals[p.id] || 0;
      const extra =
        subtotal > 0
          ? Math.round((items / subtotal) * overhead)
          : Math.round(overhead / participants.length);
      return [p.id, items + extra];
    }),
  );
}

function BillSplitPreview({ cartItems, participants, paymentStatuses, currentUserId, onPay }) {
  const [splitMode, setSplitMode] = useState('equal');

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems],
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + tax;

  const shares = useMemo(
    () => calculateShares(splitMode, cartItems, participants),
    [splitMode, cartItems, participants],
  );

  const myShare = shares[currentUserId] || 0;

  return (
    <div className="bsp-root">
      <div className="bsp-tabs" role="tablist">
        {SPLIT_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={splitMode === mode.id}
            className={`bsp-tab ${splitMode === mode.id ? 'bsp-tab--active' : ''}`}
            onClick={() => setSplitMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="bsp-cards">
        {participants.map((p) => {
          const status = paymentStatuses[p.id] || 'pending';
          const { className, label } = STATUS_MAP[status];
          return (
            <div key={p.id} className="bsp-card">
              <div className="bsp-card-name">
                <div className="bsp-avatar" style={{ background: p.avatarColor }}>
                  {p.initials}
                </div>
                <span>{p.name}</span>
              </div>
              <div className="bsp-card-amount">₹{shares[p.id] || 0}</div>
              <span className={`bsp-status ${className}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div className="bsp-summary">
        <div className="bsp-summary-row">
          <span className="bsp-summary-label">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="bsp-summary-row">
          <span className="bsp-summary-label">Delivery fee</span>
          <span>₹{DELIVERY_FEE}</span>
        </div>
        <div className="bsp-summary-row">
          <span className="bsp-summary-label">Taxes (5%)</span>
          <span>₹{tax}</span>
        </div>
        <div className="bsp-summary-row bsp-summary-row--total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        type="button"
        className="bsp-pay-btn"
        onClick={() => onPay(myShare)}
        disabled={paymentStatuses[currentUserId] === 'paid'}
      >
        {paymentStatuses[currentUserId] === 'paid'
          ? '✓ Payment sent'
          : `Pay my share · ₹${myShare}`}
      </button>
    </div>
  );
}

BillSplitPreview.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      qty: PropTypes.number.isRequired,
      participantId: PropTypes.string.isRequired,
    }),
  ).isRequired,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      initials: PropTypes.string.isRequired,
      avatarColor: PropTypes.string,
    }),
  ).isRequired,
  paymentStatuses: PropTypes.objectOf(PropTypes.oneOf(['pending', 'waiting', 'paid'])),
  currentUserId: PropTypes.string.isRequired,
  onPay: PropTypes.func.isRequired,
};

BillSplitPreview.defaultProps = {
  paymentStatuses: {},
};

export default BillSplitPreview;