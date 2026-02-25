import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import useHaptic from '../../hooks/useHaptic';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap, heavyTap, successTap } = useHaptic();
  const { getCartTotal, clearCart } = useAppStore();

  // Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressLine, setAddressLine] = useState("123 Food Street, Sector 4, CA 90210");
  const [tempAddress, setTempAddress] = useState(addressLine);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Order Calculations matching cart
  const subtotal = getCartTotal();
  const deliveryFee = 0; // FREE
  const taxes = subtotal > 0 ? 4.50 : 0;
  // Let's assume they used wallet in cart for now or omit it. Let's omit wallet for simplicity or just apply a fixed discount if subtotal > 0
  const walletApplied = 5.00;
  const totalPay = subtotal > 0 ? subtotal + deliveryFee + taxes - walletApplied : 0;

  const handleSaveAddress = () => {
    lightTap();
    setAddressLine(tempAddress);
    setIsEditingAddress(false);
  };

  const handlePlaceOrder = () => {
    heavyTap();
    // Simulate API call and success state
    setTimeout(() => {
      successTap();
      toast.success('Order placed successfully!', {
        icon: '🎉',
        style: {
          borderRadius: '2rem',
          background: '#333',
          color: '#fff',
          padding: '1rem 1.5rem',
        },
      });
      clearCart();
      navigate('/home', { replace: true });
    }, 600);
  };

  const PAYMENT_OPTIONS = [
    { id: 'upi', label: 'UPI / Grid', icon: 'qr_code_scanner' },
    { id: 'card', label: 'Credit & Debit Cards', icon: 'credit_card' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'payments' },
  ];

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <button className="cart-icon-btn" onClick={() => { mediumTap(); navigate(-1); }}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="checkout-header-title">
            <h1>Checkout</h1>
          </div>
          <div style={{ width: 40 }} /> {/* Spacer */}
        </div>
      </header>

      <div className="checkout-content">
        
        {/* Delivery Address Section */}
        <section>
          <h2 className="checkout-section-title">Delivery Address</h2>
          <div className="checkout-card">
            <div className="address-row">
              <div className="address-icon">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div className="address-info">
                <h4>Home</h4>
                <p>{addressLine}</p>
                
                <AnimatePresence>
                  {isEditingAddress && (
                    <motion.div 
                      className="address-form"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <input 
                        type="text" 
                        className="address-input" 
                        value={tempAddress}
                        onChange={(e) => setTempAddress(e.target.value)}
                        placeholder="Enter full delivery address..."
                      />
                      <button className="address-save-btn" onClick={handleSaveAddress}>Save Address</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isEditingAddress && (
                <button 
                  className="address-edit-btn" 
                  onClick={() => { lightTap(); setIsEditingAddress(true); }}
                >
                  Change
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section>
          <h2 className="checkout-section-title">Payment Method</h2>
          <div className="payment-methods">
            {PAYMENT_OPTIONS.map(option => (
              <div 
                key={option.id}
                className={`payment-method-card ${paymentMethod === option.id ? 'selected' : ''}`}
                onClick={() => { lightTap(); setPaymentMethod(option.id); }}
              >
                <div className="payment-method-left">
                  <div className="payment-icon">
                    <span className="material-symbols-outlined">{option.icon}</span>
                  </div>
                  <span className="payment-name">{option.label}</span>
                </div>
                <div className="payment-radio">
                  <div className="payment-radio-inner" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary Section */}
        <section>
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-card order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span style={{ color: '#22c55e', fontWeight: 500 }}>FREE</span>
            </div>
            <div className="summary-row">
              <span>Taxes & Charges</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Wallet Applied</span>
              <span style={{ color: 'var(--color-primary)' }}>- ${walletApplied.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Payable</span>
              <span>${Math.max(0, totalPay).toFixed(2)}</span>
            </div>
          </div>
        </section>

      </div>

      {/* Sticky Bottom Action */}
      <div className="checkout-fixed-bottom">
        <div>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            <span>Place Order</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Checkout;
