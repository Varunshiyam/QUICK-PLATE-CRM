import React from 'react';
import PropTypes from 'prop-types';
import './GroupOrderButton.css';

function GroupOrderButton({ restaurantId, onStart, disabled, loading }) {
  const handleClick = () => {
    if (!disabled && !loading && onStart) {
      onStart(restaurantId);
    }
  };

  return (
    <button
      type="button"
      className={`gob-root ${loading ? 'gob-root--loading' : ''}`}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label="Start a group order"
      aria-busy={loading}
    >
      {loading ? (
        <span className="gob-spinner" aria-hidden="true" />
      ) : (
        <svg
          className="gob-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )}
      <span className="gob-label">
        {loading ? 'Starting group order…' : 'Start group order'}
      </span>
    </button>
  );
}

GroupOrderButton.propTypes = {
  restaurantId: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

GroupOrderButton.defaultProps = {
  disabled: false,
  loading: false,
};

export default GroupOrderButton;