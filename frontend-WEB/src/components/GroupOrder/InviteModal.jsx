import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './InviteModal.css';

const SHARE_PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { id: 'message', label: 'Message', color: null },
  { id: 'more', label: 'More', color: null },
];

function InviteModal({ sessionLink, participants, onClose, onProceedToCart }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(sessionLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('input');
      el.value = sessionLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [sessionLink]);

  const handleShare = useCallback(
    (platform) => {
      if (platform === 'whatsapp') {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`Join my QuickPlate group order: ${sessionLink}`)}`,
          '_blank',
          'noopener,noreferrer',
        );
      } else if (navigator.share) {
        navigator.share({ title: 'Join my QuickPlate group order', url: sessionLink });
      }
    },
    [sessionLink],
  );

  return (
    <div className="im-overlay" role="dialog" aria-modal="true" aria-labelledby="im-title">
      <div className="im-card">
        <div className="im-header">
          <h2 className="im-title" id="im-title">
            Group order started 🎉
          </h2>
          <button type="button" className="im-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p className="im-sub">Share this link so everyone can add their items</p>

        <div className="im-link-box">
          <span className="im-link-text">{sessionLink}</span>
          <button type="button" className="im-copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <div className="im-share-row">
          {SHARE_PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="im-share-btn"
              onClick={() => handleShare(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {participants.length > 0 && (
          <div className="im-participants">
            <p className="im-participants-label">
              {participants.length} {participants.length === 1 ? 'person' : 'people'} joined
            </p>
            <div className="im-avatars">
              {participants.map((p) => (
                <div key={p.id} className="im-avatar" title={p.name}>
                  {p.initials}
                </div>
              ))}
              <div className="im-avatar im-avatar--add">+</div>
            </div>
          </div>
        )}

        <button type="button" className="im-proceed-btn" onClick={onProceedToCart}>
          View shared cart →
        </button>
      </div>
    </div>
  );
}

InviteModal.propTypes = {
  sessionLink: PropTypes.string.isRequired,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      initials: PropTypes.string.isRequired,
    }),
  ),
  onClose: PropTypes.func.isRequired,
  onProceedToCart: PropTypes.func.isRequired,
};

InviteModal.defaultProps = {
  participants: [],
};

export default InviteModal;