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

    const [showMenu, setShowMenu] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [helpForm, setHelpForm] = useState({
      issueType: '',
      email: '',
      description: ''
      });
    const [helpSubmitted, setHelpSubmitted] = useState(false);

  // ========================================
  // COUPON STATE
  // ========================================

  const [couponInput, setCouponInput] =
    useState('');

  const [appliedCoupon, setAppliedCoupon] =
    useState(null);

  const [couponError, setCouponError] =
    useState('');

  const [showCelebration, setShowCelebration] =
    useState(false);

  const [showCouponSheet, setShowCouponSheet] =
    useState(false);

  const [couponEligibility, setCouponEligibility] =
    useState({
      isFirstOrder:   null,
      accountAgeDays: null,
    });

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

  useEffect(() => {

    const checkEligibility = async () => {

      try {

        const firebaseUser = auth.currentUser;

        let accountAgeDays = 0;
        if (firebaseUser?.metadata?.creationTime) {
          const created = new Date(firebaseUser.metadata.creationTime);
          accountAgeDays = Math.floor(
            (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        let isFirstOrder = true;
        if (firebaseUser && API_BASE_URL) {
          try {
            const idToken = await firebaseUser.getIdToken(true);
            const res = await axios.get(
              `${API_BASE_URL}/services/apexrest/customer/orders?idToken=${encodeURIComponent(idToken)}`
            );
            const orders = res.data?.orders || [];
            isFirstOrder = orders.length === 0;
          } catch {
            isFirstOrder = false;
          }
        }

        setCouponEligibility({
          isFirstOrder,
          accountAgeDays,
          usedCodes: [],
        });

      } catch (err) {
        console.error('Coupon eligibility check failed:', err);
      }
    };

    checkEligibility();

  }, []);

  const { isFirstOrder, accountAgeDays } = couponEligibility;
  const eligibilityLoading = isFirstOrder === null || accountAgeDays === null;

  const today = new Date();
  const month = today.getMonth() + 1;
  const day   = today.getDate();

  const AVAILABLE_COUPONS = [

    {
      code:        'WELCOME10',
      label:       'First Purchase',
      description: 'Exclusively for first-time buyers. Welcome aboard!',
      badge:       '🎉 New User',
      type:        'percent',
      value:       10,
      minOrder:    0,
      category:    'welcome',
      isEligible:  () => isFirstOrder === true,
      lockReason:  () => isFirstOrder === false ? 'Not a first order' : null,
    },

    {
      code:        'LOYAL1',
      label:       'Loyalty Reward',
      description: 'For members with us for over a year. Thank you!',
      badge:       '⭐ Loyal Member',
      type:        'percent',
      value:       5,
      minOrder:    0,
      category:    'loyalty',

      isEligible:  () => accountAgeDays >= 365,
      lockReason:  () => accountAgeDays < 365 ? `Available after 6 months (${Math.max(0, 365 - accountAgeDays)}d left)` : null,
    },

    {
      code:        'LOYAL5',
      label:       'Super Loyalty',
      description: 'Exclusive for members with us over 5 years. You rock!',
      badge:       '💎 VIP Member',
      type:        'percent',
      value:       15,
      minOrder:    0,
      category:    'loyalty',

      isEligible:  () => accountAgeDays >= 1825,
      lockReason:  () => accountAgeDays < 1825 ? `Available after 1 year (${Math.max(0, 1825 - accountAgeDays)}d left)` : null,
    },

    {
      code:        'SAVE500',
      label:       'Big Saver',
      description: 'Save ₹500 on orders above ₹2000. Stack up!',
      badge:       '🛒 Cart Offer',
      type:        'flat',
      value:       500,
      minOrder:    2000,
      category:    'cart',

      isEligible:  () => subtotal >= 2000,
      lockReason:  () =>
        subtotal < 2000
          ? `Add ₹${(2000 - subtotal).toFixed(0)} more to unlock`
          : null,
    },

    {
      code:        'INDIA15',
      label:       'Independence Day',
      description: '15% off on Independence Day. Jai Hind! 🇮🇳',
      badge:       '🇮🇳 Seasonal',
      type:        'percent',
      value:       15,
      minOrder:    0,
      category:    'seasonal',

      isEligible:  () => month === 8 && day === 15,
      lockReason:  () =>
        !(month === 8 && day === 15)
          ? 'Available on 15th August only'
          : null,
    },

    {
      code:        'NEWYEAR20',
      label:       'New Year Special',
      description: '20% off to ring in the New Year with great food!',
      badge:       '🎆 New Year',
      type:        'percent',
      value:       20,
      minOrder:    0,
      category:    'seasonal',

      isEligible:  () =>
        (month === 12 && day === 31) ||
        (month === 1  && day <= 2),
      lockReason:  () =>
        !((month === 12 && day === 31) || (month === 1 && day <= 2))
          ? 'Available Dec 31 – Jan 2 only'
          : null,
    },

  ];

  const applyCouponCode = (code) => {

    const trimmed = code.trim().toUpperCase();
    const found   = AVAILABLE_COUPONS.find(c => c.code === trimmed);

    if (!found) {
      setCouponError('Invalid coupon code. Please try again.');
      return;
    }

    if (eligibilityLoading) {
      setCouponError('Checking eligibility, please wait...');
      return;
    }

    if (!found.isEligible()) {
      const reason = found.lockReason();
      setCouponError(reason || 'You are not eligible for this coupon.');
      return;
    }

    setAppliedCoupon(found);
    setCouponError('');
    setCouponInput('');
    setShowCouponSheet(false);
    setShowCelebration(true);
    mediumTap();
    setTimeout(() => setShowCelebration(false), 2800);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    lightTap();
  };

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

  const couponDiscount = (() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (appliedCoupon.type === 'percent') {
      return parseFloat(((subtotal * appliedCoupon.value) / 100).toFixed(2));
    }
    return Math.min(appliedCoupon.value, subtotal);
  })();

  const maxApplicableWallet =
    Math.min(
      walletBalance,
      subtotal + deliveryFee + taxes - couponDiscount
    );

  const walletApplied =
    useWallet && subtotal > 0
      ? maxApplicableWallet
      : 0;

  const totalPay =
    subtotal +
    deliveryFee +
    taxes -
    couponDiscount -
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
    const handleHelpSubmit = () => {
    if (!helpForm.issueType || !helpForm.email || !helpForm.description) {
      alert('Please fill all fields.');
      return;
    }
    console.log('Help Request:', helpForm);
    setHelpSubmitted(true);
    setTimeout(() => {
      setShowHelpModal(false);
      setHelpSubmitted(false);
      setHelpForm({ issueType: '', email: '', description: '' });
    }, 2000);
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

        <div className="empty-cart-view">

          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '64px',
              opacity: 0.5
            }}
          >
            shopping_basket
          </span>

          <h2>Your cart is empty</h2>

          <p>
            Craving something delicious? Let's fix that.
          </p>

          <button
            className="empty-cart-btn"
            onClick={() => {
              lightTap();
              navigate('/restaurant');
            }}
          >
            Browse Menu
          </button>

        </div>

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

            {/* COUPON SECTION */}

            <div className="coupon-section">

              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    className="coupon-celebration"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="confetti-burst">
                      {['🎉','✨','🎊','💥','⭐','🌟'].map((e, i) => (
                        <span key={i} className={`confetti-piece piece-${i}`}>{e}</span>
                      ))}
                    </div>
                    <p className="celebration-text">Coupon Applied! 🎉</p>
                    <p className="celebration-sub">
                      You saved {appliedCoupon?.type === 'percent'
                        ? `${appliedCoupon?.value}%`
                        : `₹${appliedCoupon?.value}`
                      }!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {appliedCoupon ? (

                <motion.div
                  className="coupon-applied-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="coupon-applied-left">
                    <span className="coupon-applied-icon">🏷️</span>
                    <div>
                      <p className="coupon-applied-code">{appliedCoupon.code}</p>
                      <p className="coupon-applied-savings">
                        You saved {appliedCoupon.type === 'percent'
                          ? `${appliedCoupon.value}% (₹${couponDiscount.toFixed(2)})`
                          : `₹${couponDiscount.toFixed(2)}`
                        }
                      </p>
                    </div>
                  </div>
                  <button className="coupon-remove-btn" onClick={removeCoupon}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                </motion.div>

              ) : (

                <div className="coupon-input-row">
                  <div className="coupon-input-wrap">
                    <span className="material-symbols-outlined coupon-input-icon">
                      local_offer
                    </span>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={e => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') applyCouponCode(couponInput);
                      }}
                    />
                  </div>
                  <button
                    className="coupon-apply-btn"
                    onClick={() => applyCouponCode(couponInput)}
                    disabled={!couponInput.trim()}
                  >
                    Apply
                  </button>
                </div>

              )}

              {couponError && (
                <motion.p
                  className="coupon-error"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {couponError}
                </motion.p>
              )}

              {!appliedCoupon && (
                <button
                  className="coupon-view-all-btn"
                  onClick={() => {
                    lightTap();
                    setShowCouponSheet(true);
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    confirmation_number
                  </span>
                  View available coupons
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    chevron_right
                  </span>
                </button>
              )}

            </div>

            <AnimatePresence>
              {showCouponSheet && (
                <>
                  <motion.div
                    className="coupon-sheet-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowCouponSheet(false)}
                  />
                  <motion.div
                    className="coupon-sheet"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  >
                    <div className="coupon-sheet-handle" />
                    <div className="coupon-sheet-header">
                      <h3 className="coupon-sheet-title">Available Coupons</h3>
                      <button
                        className="cart-icon-btn"
                        onClick={() => setShowCouponSheet(false)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    <div className="coupon-sheet-input-row">
                      <div className="coupon-input-wrap">
                        <span className="material-symbols-outlined coupon-input-icon">
                          local_offer
                        </span>
                        <input
                          type="text"
                          className="coupon-input"
                          placeholder="Or type a code manually"
                          value={couponInput}
                          onChange={e => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError('');
                          }}
                        />
                      </div>
                      <button
                        className="coupon-apply-btn"
                        onClick={() => applyCouponCode(couponInput)}
                        disabled={!couponInput.trim()}
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <p className="coupon-error" style={{ padding: '0 1.5rem' }}>
                        {couponError}
                      </p>
                    )}

                    <div className="coupon-list no-scrollbar">
                      {eligibilityLoading ? (
                        <div className="coupon-loading">
                          <span className="material-symbols-outlined coupon-loading-icon">
                            pending
                          </span>
                          <p>Checking your eligibility...</p>
                        </div>
                      ) : (
                        AVAILABLE_COUPONS.map(coupon => {
                          const eligible   = coupon.isEligible();
                          const lockReason = coupon.lockReason();
                          const isLocked   = !eligible;
                          return (
                            <div
                              key={coupon.code}
                              className={`coupon-card ${isLocked ? 'coupon-locked' : ''}`}
                            >
                              <div className="coupon-card-left">
                                <span className="coupon-badge">{coupon.badge}</span>
                                <h4 className="coupon-card-label">{coupon.label}</h4>
                                <p className="coupon-card-desc">{coupon.description}</p>
                                {isLocked && lockReason && (
                                  <p className="coupon-lock-msg">
                                    🔒 {lockReason}
                                  </p>
                                )}
                              </div>
                              <div className="coupon-card-sep" />
                              <div className="coupon-card-right">
                                <div className="coupon-code-pill">{coupon.code}</div>
                                <p className="coupon-card-value">
                                  {coupon.type === 'percent'
                                    ? `${coupon.value}% OFF`
                                    : `₹${coupon.value} OFF`
                                  }
                                </p>
                                <button
                                  className="coupon-use-btn"
                                  disabled={isLocked}
                                  onClick={() => {
                                    if (!isLocked) applyCouponCode(coupon.code);
                                  }}
                                >
                                  {isLocked ? 'Locked' : 'Apply'}
                                </button>
                              </div>
                              <div className="coupon-notch coupon-notch-top" />
                              <div className="coupon-notch coupon-notch-bot" />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

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

                  {appliedCoupon && couponDiscount > 0 && (

                    <motion.div
                      className="bill-row"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#22c55e' }}>
                          local_offer
                        </span>
                        {appliedCoupon.code}
                      </span>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>
                        - ₹{couponDiscount.toFixed(2)}
                      </span>
                    </motion.div>

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
              {/* HELP MODAL */}
      {showHelpModal && (
        <div className="help-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>

            <div className="help-modal-header">
              <h2>Need Help?</h2>
              <button className="help-modal-close" onClick={() => setShowHelpModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {helpSubmitted ? (
              <div className="help-modal-success">
                <span className="material-symbols-outlined">check_circle</span>
                <p>Query submitted! We'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="help-modal-field">
                  <label>Issue Type</label>
                  <select
                    value={helpForm.issueType}
                    onChange={(e) => setHelpForm({ ...helpForm, issueType: e.target.value })}
                  >
                    <option value="">Select an issue</option>
                    <option value="wrong_item">Wrong Item</option>
                    <option value="payment_issue">Payment Issue</option>
                    <option value="cancel_order">Cancel Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="help-modal-field">
                  <label>Your Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={helpForm.email}
                    onChange={(e) => setHelpForm({ ...helpForm, email: e.target.value })}
                  />
                </div>

                <div className="help-modal-field">
                  <label>Describe your issue</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what went wrong..."
                    value={helpForm.description}
                    onChange={(e) => setHelpForm({ ...helpForm, description: e.target.value })}
                  />
                </div>

                <button className="help-modal-submit" onClick={handleHelpSubmit}>
                  Submit Query
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div> 
  );
};

export default Cart;