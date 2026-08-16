/**
 * useHaptic — Custom hook for haptic feedback on mobile devices.
 * Uses the Vibration API for native-like touch feedback.
 */

const useHaptic = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  /** Light tap — button presses, toggles */
  const lightTap = () => {
    if (isSupported) navigator.vibrate(10);
  };

  /** Medium tap — selections, confirmations */
  const mediumTap = () => {
    if (isSupported) navigator.vibrate(25);
  };

  /** Heavy tap — errors, warnings, important actions */
  const heavyTap = () => {
    if (isSupported) navigator.vibrate(50);
  };

  /** Success pattern — order confirmed, payment done */
  const success = () => {
    if (isSupported) navigator.vibrate([10, 50, 20, 50, 10]);
  };

  /** Error pattern — failed action, validation error */
  const error = () => {
    if (isSupported) navigator.vibrate([50, 100, 50]);
  };

  /** Notification — new order update, message */
  const notification = () => {
    if (isSupported) navigator.vibrate([15, 30, 15]);
  };

  return {
    isSupported,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    error,
    notification,
  };
};

export default useHaptic;
