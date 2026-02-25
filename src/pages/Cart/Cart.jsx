import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import useHaptic from '../../hooks/useHaptic';
import './Cart.css';
import '../Home/Home.css'; // Required for shared bottom nav classes during hard-reloads
import { menuAssets } from '../../assets/images/menu-items';
import { getRestaurantMenu } from '../../data/mockMenus';

const Cart = () => {
  const { cart, removeFromCart, addToCart, getCartTotal, cartRestaurant, cartRestaurantId } = useAppStore();
  const { lightTap, mediumTap, heavyTap } = useHaptic();
  const navigate = useNavigate();
  const [useWallet, setUseWallet] = useState(true);

  // Dynamic Addons from Current Restaurant Mapping Context 
  const restData = cartRestaurant || { name: cartRestaurantId || "L'Artisan Bistro" };
  const { menu } = getRestaurantMenu(restData);
  const _allRestItems = menu.flatMap(cat => cat.items);
  const availableAddons = _allRestItems.filter(
    item => !cart.some(cItem => cItem.id === item.id)
  );
  // Pick the top 4 remaining ones 
  const ADDONS = availableAddons.slice(0, 4);

  // Computed totals
  const subtotal = getCartTotal();
  const deliveryFee = 0; // FREE in mockup
  const taxes = subtotal > 0 ? 4.50 : 0;
  const walletApplied = useWallet && subtotal > 0 ? 5.00 : 0;
  
  const totalPay = subtotal + deliveryFee + taxes - walletApplied;

  const handleCheckout = () => {
    heavyTap();
  };

  const handleAddAddon = (addon) => {
    lightTap();
    addToCart(
      {
        id: addon.id,
        title: addon.title,
        price: addon.price,
        img: addon.img,
        quantity: 1
      },
      restData
    );
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="cart-header">
        <div className="cart-header-inner">
          <button className="cart-icon-btn" onClick={() => { mediumTap(); navigate(-1); }}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="cart-header-title">
            <h1>Your Cart</h1>
            <p className="cart-header-subtitle">
              {restData.name} <span className="material-symbols-outlined" style={{ fontSize: '12px', fontVariationSettings: '"FILL" 1' }}>verified</span>
            </p>
          </div>
          <button className="cart-icon-btn">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </header>

      {cart.length === 0 ? (
        <div className="empty-cart-view">
          <span className="material-symbols-outlined" style={{ fontSize: '64px', opacity: 0.5 }}>shopping_basket</span>
          <h2>Your cart is empty</h2>
          <p>Craving something delicious? Let's fix that.</p>
          <button className="empty-cart-btn" onClick={() => { lightTap(); navigate('/restaurant'); }}>
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="cart-content">
            <div className="cart-items-section">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout // Animate layout changes like removal gracefully
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="cart-item-card cart-item-shadow"
                  >
                    <img src={item.img} alt={item.title} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <h3 className="cart-item-title">{item.title}</h3>
                        <p className="cart-item-price">{item.price}</p>
                      </div>
                      <p className="cart-item-meta">{item.desc ? item.desc.slice(0, 35) + '...' : 'Freshly prepared for you'}</p>
                      <div className="cart-item-actions">
                        <div className="cart-stepper">
                          <button 
                            className="cart-stepper-btn" 
                            onClick={() => { lightTap(); removeFromCart(item.id); }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>remove</span>
                          </button>
                          <span className="cart-stepper-count">{item.quantity}</span>
                          <button 
                            className="cart-stepper-btn add" 
                            onClick={() => { lightTap(); addToCart(item, 'mock_restaurant'); }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                          </button>
                        </div>
                        <button 
                          className="cart-delete-btn"
                          onClick={() => { mediumTap(); removeFromCart(item.id); /* To fully remove could loop to 0 but this fits UX fast */ }}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="addons-section">
              <div className="addons-header">
                <h4 className="addons-title">Add more items</h4>
                <button className="addons-view-all">View All</button>
              </div>
              <div className="addons-list no-scrollbar">
                {ADDONS.map(addon => (
                  <div key={addon.id} className="addon-card">
                    {addon.img ? (
                      <img src={addon.img} alt={addon.title} className="addon-img" />
                    ) : (
                      <div className="addon-placeholder">
                        <span className="material-symbols-outlined">local_bar</span>
                      </div>
                    )}
                    <h5 className="addon-name">{addon.title}</h5>
                    <div className="addon-bottom">
                      <span className="addon-price">{addon.price}</span>
                      <button className="addon-add-btn" onClick={() => handleAddAddon(addon)}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bill-section">
              <div className="bill-card">
                <div className="wallet-row">
                  <div className="wallet-info">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance_wallet</span>
                    <span>Wallet Credit</span>
                  </div>
                  <button 
                    className={`wallet-toggle ${useWallet ? 'active' : ''}`}
                    onClick={() => { lightTap(); setUseWallet(!useWallet); }}
                  >
                    <div className="knob" />
                  </button>
                </div>
                
                <div className="bill-details">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="bill-row">
                    <span>Delivery Fee</span>
                    <span style={{ color: '#22c55e', fontWeight: 500 }}>FREE</span>
                  </div>
                  <div className="bill-row">
                    <span>Taxes & Charges</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  {useWallet && (
                    <div className="bill-row">
                      <span>Wallet Applied</span>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>- ${walletApplied.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="bill-row total">
                    <span>Total Pay</span>
                    <span>${Math.max(0, totalPay).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-checkout-wrapper" style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
            <button className="checkout-btn" onClick={handleCheckout}>
              <span>Proceed to Checkout</span>
              <div className="checkout-btn-right">
                <div className="checkout-divider" />
                <span>${Math.max(0, totalPay).toFixed(2)}</span>
              </div>
            </button>
          </div>
        </>
      )}

      {/* ─── Bottom Navigation ─── */}
      <nav className="home-bottom-nav glass-nav-override" style={{ zIndex: 40, borderTop: 'none' }}>
        <div className="home-bottom-nav-inner">
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined" style={{ color: '#94A3B8' }}>home</span>
            <span style={{ color: '#94A3B8' }}>Home</span>
          </Link>
          <div className="home-nav-item" onClick={() => { lightTap(); navigate('/restaurant'); }}>
            <span className="material-symbols-outlined" style={{ color: '#94A3B8' }}>explore</span>
            <span style={{ color: '#94A3B8' }}>Discover</span>
          </div>
          <div className="home-nav-item" style={{ marginTop: '-4px' }}>
            <div className="nav-active-dot" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '4px', width: '4px', height: '4px', borderRadius: '50%' }} />
            <span className="material-symbols-outlined nav-active fill-1" style={{ color: 'var(--color-primary)' }}>receipt_long</span>
            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Orders</span>
          </div>
          <Link to="/profile" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined" style={{ color: '#94A3B8' }}>person</span>
            <span style={{ color: '#94A3B8' }}>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Cart;
