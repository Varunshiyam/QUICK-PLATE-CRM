import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios';

import useAppStore from '../../store/useAppStore';
import useHaptic from '../../hooks/useHaptic';

import { auth } from '../../services/firebase';

import './Cart.css';
import '../Home/Home.css';

import { getRestaurantMenu } from '../../data/mockMenus';

// ========================================
// API BASE URL
// ========================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

// ========================================
// COMPONENT
// ========================================

const Cart = () => {

  // ========================================
  // STORE
  // ========================================

  const {
    cart,
    removeFromCart,
    addToCart,
    getCartTotal,
    cartRestaurant,
    cartRestaurantId
  } = useAppStore();

  // ========================================
  // HAPTICS
  // ========================================

  const {
    lightTap,
    mediumTap,
    heavyTap
  } = useHaptic();

  const navigate = useNavigate();

  // ========================================
  // STATE
  // ========================================

  const [useWallet, setUseWallet] =
    useState(true);

  const [isLoading, setLoading] =
    useState(false);

  const [walletBalance, setWalletBalance] =
    useState(0);

  const [isWalletLoading, setWalletLoading] =
    useState(true);

  // ========================================
  // RESTAURANT CONTEXT
  // ========================================

  const restData =
    cartRestaurant || {
      name: cartRestaurantId || "Restaurant"
    };

  // ========================================
  // MENU ADDONS
  // ========================================

  const { menu } =
    getRestaurantMenu(restData);

  const allRestaurantItems =
    menu.flatMap(cat => cat.items);

  const availableAddons =
    allRestaurantItems.filter(
      item =>
        !cart.some(
          cItem => cItem.id === item.id
        )
    );

  const ADDONS =
    availableAddons.slice(0, 4);

  // ========================================
  // BILLING
  // ========================================

  const subtotal =
    getCartTotal();

  const deliveryFee = 0;

  const taxes =
    subtotal > 0
      ? 4.50
      : 0;

  const maxApplicableWallet =
    Math.min(
      walletBalance,
      subtotal + deliveryFee + taxes
    );

  const walletApplied =
    useWallet && subtotal > 0
      ? maxApplicableWallet
      : 0;

  const totalPay =
    subtotal +
    deliveryFee +
    taxes -
    walletApplied;

  // ========================================
  // FETCH WALLET BALANCE
  // ========================================

  useEffect(() => {

    const fetchWalletBalance =
      async () => {

        try {

          // ========================================
          // FIREBASE USER
          // ========================================

          const firebaseUser =
            auth.currentUser;

          if (!firebaseUser) {

            console.warn(
              'Firebase user missing.'
            );

            return;
          }

          // ========================================
          // GET FRESH TOKEN
          // ========================================

          const idToken =
            await firebaseUser.getIdToken(
              true
            );

          if (!idToken) {

            console.warn(
              'Firebase token missing.'
            );

            return;
          }

          // ========================================
          // API URL VALIDATION
          // ========================================

          if (!API_BASE_URL) {

            console.warn(
              'API base URL missing.'
            );

            return;
          }

          console.log(
            'Fetching Wallet Balance...'
          );

          // ========================================
          // API CALL
          // ========================================

          const response =
            await axios.get(

              `${API_BASE_URL}/services/apexrest/wallet/balance?token=${idToken}`,

              {
                headers: {
                  'Content-Type':
                    'application/json'
                },

                timeout: 15000
              }
            );

          console.log(
            'Wallet Response:',
            response.data
          );

          // ========================================
          // SUCCESS
          // ========================================

          if (response.data?.success) {

            setWalletBalance(
              response.data
                .availableBalance || 0
            );

          } else {

            console.warn(
              response.data?.message ||
              'Wallet fetch failed.'
            );
          }

        } catch (err) {

          console.error(
            'Wallet Balance Error:',
            err.response?.data ||
            err.message
          );

        } finally {

          setWalletLoading(false);
        }
      };

    // ========================================
    // INITIAL LOAD
    // ========================================

    fetchWalletBalance();

    // ========================================
    // AUTO REFRESH
    // ========================================

    const interval =
      setInterval(
        fetchWalletBalance,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  // ========================================
  // CHECKOUT
  // ========================================

  const handleCheckout =
    async () => {

      try {

        heavyTap();

        setLoading(true);

        // ========================================
        // FIREBASE USER
        // ========================================

        const firebaseUser =
          auth.currentUser;

        if (!firebaseUser) {

          throw new Error(
            'Please login again.'
          );
        }

        // ========================================
        // GET TOKEN
        // ========================================

        const idToken =
          await firebaseUser.getIdToken(
            true
          );

        if (!idToken) {

          throw new Error(
            'Authentication failed.'
          );
        }

        // ========================================
        // VALIDATE RESTAURANT
        // ========================================

        if (!restData?.id) {

          throw new Error(
            'Restaurant reference missing.'
          );
        }

        // ========================================
        // VALIDATE TOTAL
        // ========================================

        const cartTotal =
          Number(totalPay);

        if (
          !cartTotal ||
          cartTotal <= 0
        ) {

          throw new Error(
            'Invalid cart total.'
          );
        }

        console.log(
          'Creating Order...'
        );

        console.log({
          restaurantId:
            restData.id,

          orderTotal:
            cartTotal,

          creditsUsed:
            walletApplied
        });

        // ========================================
        // CREATE ORDER
        // ========================================

        const response =
          await axios.post(

            `${API_BASE_URL}/services/apexrest/order/create`,

            {
              idToken,

              restaurantId:
                restData.id,

              orderTotal:
                cartTotal,

              creditsUsed:
                Number(walletApplied)
            },

            {
              headers: {
                'Content-Type':
                  'application/json'
              },

              timeout: 15000
            }
          );

        console.log(
          'Order Response:',
          response.data
        );

        // ========================================
        // VALIDATE RESPONSE
        // ========================================

        if (
          !response.data?.success
        ) {

          throw new Error(
            response.data?.message ||
            'Order creation failed.'
          );
        }

        // ========================================
        // SUCCESS
        // ========================================

        const orderId =
          response.data.orderId;

        console.log(
          'Order Created:',
          orderId
        );

        navigate(
          '/checkout',
          {
            state: {

              orderId,

              useWallet,

              computedWalletApplied:
                walletApplied,

              computedSubtotal:
                subtotal,

              computedTaxes:
                taxes,

              computedTotalPay:
                totalPay
            }
          }
        );

      } catch (error) {

        console.error(
          'Checkout Error:',
          error.response?.data ||
          error.message
        );

        alert(
          error.response?.data?.message ||
          error.message
        );

      } finally {

        setLoading(false);
      }
    };

  // ========================================
  // ADD ADDON
  // ========================================

  const handleAddAddon =
    (addon) => {

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

  // ========================================
  // UI
  // ========================================

  return (

    <div className="cart-page">

      {/* HEADER */}

      <header className="cart-header">

        <div className="cart-header-inner">

          <button
            className="cart-icon-btn"
            onClick={() => {
              mediumTap();
              navigate(-1);
            }}
          >
            <span className="material-symbols-outlined">
              arrow_back_ios_new
            </span>
          </button>

          <div className="cart-header-title">

            <h1>Your Cart</h1>

            <p className="cart-header-subtitle">

              {restData.name}

              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '12px',
                  fontVariationSettings: '"FILL" 1'
                }}
              >
                verified
              </span>

            </p>

          </div>

          <button className="cart-icon-btn">

            <span className="material-symbols-outlined">
              more_horiz
            </span>

          </button>

        </div>

      </header>

      {/* EMPTY CART */}

      {cart.length === 0 ? (

        <motion.div
          className="empty-cart-view"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >

          {/* Illustrated SVG — QuickPlate themed */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Plate base */}
              <circle cx="70" cy="85" r="42" fill="#fff4ec" stroke="#fb7e18" strokeWidth="2.5" />
              <circle cx="70" cy="85" r="30" fill="#fff" stroke="#fde0c8" strokeWidth="1.5" />

              {/* Fork */}
              <rect x="55" y="58" width="3" height="22" rx="1.5" fill="#fb7e18" opacity="0.5" />
              <rect x="51" y="56" width="2" height="10" rx="1" fill="#fb7e18" opacity="0.4" />
              <rect x="55" y="56" width="2" height="10" rx="1" fill="#fb7e18" opacity="0.4" />
              <rect x="59" y="56" width="2" height="10" rx="1" fill="#fb7e18" opacity="0.4" />

              {/* Knife */}
              <rect x="82" y="56" width="3" height="24" rx="1.5" fill="#fb7e18" opacity="0.5" />
              <path d="M82 56 Q88 62 85 68 L82 68 Z" fill="#fb7e18" opacity="0.4" />

              {/* Empty plate dot */}
              <circle cx="70" cy="85" r="5" fill="#fde0c8" />

              {/* Cart icon on top */}
              <circle cx="95" cy="42" r="20" fill="#fb7e18" />
              <text x="95" y="49" textAnchor="middle" fontSize="18" fill="white">🛒</text>

              {/* Sparkles */}
              <circle cx="30" cy="40" r="3" fill="#fb7e18" opacity="0.3" />
              <circle cx="110" cy="30" r="2" fill="#fb7e18" opacity="0.4" />
              <circle cx="25" cy="70" r="2" fill="#fde0c8" opacity="0.6" />
              <circle cx="118" cy="65" r="3" fill="#fde0c8" opacity="0.5" />
            </svg>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}
          >
            Your cart is empty
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.75rem' }}
          >
            Craving something delicious? Let's fix that.
          </motion.p>

          <motion.button
            className="empty-cart-btn"
            onClick={() => {
              lightTap();
              navigate('/restaurant');
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            whileTap={{ scale: 0.96 }}
          >
            Browse Menu
          </motion.button>

        </motion.div>

      ) : (

        <>

          {/* CONTENT */}

          <div className="cart-content">

            {/* CART ITEMS */}

            <div className="cart-items-section">

              <AnimatePresence>

                {cart.map((item) => (

                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="cart-item-card cart-item-shadow"
                  >

                    <img
                      src={item.img}
                      alt={item.title}
                      className="cart-item-img"
                    />

                    <div className="cart-item-info">

                      <div className="cart-item-top">

                        <h3 className="cart-item-title">
                          {item.title}
                        </h3>

                        <p className="cart-item-price">
                          {item.price}
                        </p>

                      </div>

                      <p className="cart-item-meta">

                        {item.desc
                          ? item.desc.slice(0, 35) + '...'
                          : 'Freshly prepared for you'}

                      </p>

                      <div className="cart-item-actions">

                        <div className="cart-stepper">

                          <button
                            className="cart-stepper-btn"
                            onClick={() => {
                              lightTap();
                              removeFromCart(item.id);
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '16px' }}
                            >
                              remove
                            </span>
                          </button>

                          <span className="cart-stepper-count">
                            {item.quantity}
                          </span>

                          <button
                            className="cart-stepper-btn add"
                            onClick={() => {
                              lightTap();
                              addToCart(item, restData);
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '16px' }}
                            >
                              add
                            </span>
                          </button>

                        </div>

                        <button
                          className="cart-delete-btn"
                          onClick={() => {
                            mediumTap();
                            removeFromCart(item.id);
                          }}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
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

            {/* BILL */}

            <div className="bill-section">

              <div className="bill-card">

                <div className="wallet-row">

                  <div className="wallet-info">

                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: '"FILL" 1'
                      }}
                    >
                      account_balance_wallet
                    </span>

                    <span>Wallet Credit</span>

                  </div>

                  <button
                    className={`wallet-toggle ${
                      useWallet ? 'active' : ''
                    }`}
                    onClick={() => {
                      lightTap();
                      setUseWallet(!useWallet);
                    }}
                  >
                    <div className="knob" />
                  </button>

                </div>

                <div className="bill-details">

                  <div className="bill-row">

                    <span>Subtotal</span>

                    <span>
                      ${subtotal.toFixed(2)}
                    </span>

                  </div>

                  <div className="bill-row">

                    <span>Delivery Fee</span>

                    <span
                      style={{
                        color: '#22c55e',
                        fontWeight: 500
                      }}
                    >
                      FREE
                    </span>

                  </div>

                  <div className="bill-row">

                    <span>Taxes & Charges</span>

                    <span>
                      ${taxes.toFixed(2)}
                    </span>

                  </div>

                  {useWallet && (

                    <div className="bill-row">

                      <span>Wallet Applied</span>

                      <span
                        style={{
                          color: 'var(--color-primary)',
                          fontWeight: 600
                        }}
                      >
                        - ${walletApplied.toFixed(2)}
                      </span>

                    </div>

                  )}

                  <div className="bill-row total">

                    <span>Total Pay</span>

                    <span>
                      ${Math.max(0, totalPay).toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* CHECKOUT */}

          <div
            className="cart-checkout-wrapper"
            style={{
              padding: '0 1.5rem 2rem 1.5rem'
            }}
          >

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isLoading}
            >

              {isLoading ? (

                <div
                  className="spinner"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderTopColor: '#fff',
                    margin: '0 auto'
                  }}
                />

              ) : (

                <>

                  <span>
                    Proceed to Checkout
                  </span>

                  <div className="checkout-btn-right">

                    <div className="checkout-divider" />

                    <span>
                      ${Math.max(0, totalPay).toFixed(2)}
                    </span>

                  </div>

                </>

              )}

            </button>

          </div>

        </>

      )}

      {/* BOTTOM NAV */}

      <nav
        className="home-bottom-nav glass-nav-override"
        style={{
          zIndex: 40,
          borderTop: 'none'
        }}
      >

        <div className="home-bottom-nav-inner">

          <Link
            to="/home"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">
              home
            </span>

            <span className="home-nav-label">
              Home
            </span>
          </Link>

          <div
            className="home-nav-item"
            onClick={() => {
              lightTap();
              navigate('/restaurant');
            }}
          >

            <span className="material-symbols-outlined">
              explore
            </span>

            <span className="home-nav-label">
              Discover
            </span>

          </div>

          <div className="home-nav-item active">

            <div style={{ position: 'relative' }}>

              <span className="material-symbols-outlined">
                receipt_long
              </span>

              <span className="home-nav-badge" />

            </div>

            <span className="home-nav-label">
              Orders
            </span>

          </div>

          <Link
            to="/profile"
            className="home-nav-item"
            onClick={lightTap}
          >

            <span className="material-symbols-outlined">
              person
            </span>

            <span className="home-nav-label">
              Profile
            </span>

          </Link>

        </div>

      </nav>

    </div>
  );
};

export default Cart;