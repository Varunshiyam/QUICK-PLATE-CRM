export function generateSessionCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function buildSessionLink(code, baseUrl = window.location.origin) {
  return `${baseUrl}/group/${code}`;
}

export function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatRupees(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function allPaid(participantIds, paymentStatuses) {
  return participantIds.every((id) => paymentStatuses[id] === 'paid');
}