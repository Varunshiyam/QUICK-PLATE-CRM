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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

const Cart = () => {

  const {
    cart,
    removeFromCart,
    addToCart,
    getCartTotal,
    cartRestaurant,
    cartRestaurantId
  } = useAppStore();

  const {
    lightTap,
    mediumTap,
    heavyTap
  } = useHaptic();

  const navigate = useNavigate();

  const [useWallet, setUseWallet] = useState(true);

  const [isLoading, setLoading] = useState(false);

  const [walletBalance, setWalletBalance] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [isWalletLoading, setWalletLoading] = useState(true);

  // ================================
  // RESTAURANT CONTEXT
  // ================================

  const restData =
    cartRestaurant || {
      name: cartRestaurantId || "L'Artisan Bistro"
    };



  // ================================
  // BILLING
  // ================================

  const subtotal = getCartTotal();

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

  // ================================
  // FETCH WALLET BALANCE
  // ================================

  useEffect(() => {

    const fetchWalletBalance = async () => {

      try {

        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {

          console.warn(
            'User not authenticated.'
          );

          return;
        }

        const idToken =
          await firebaseUser.getIdToken();

        if (!idToken) {

          console.warn(
            'Firebase token missing.'
          );

          return;
        }

        if (!API_BASE_URL) {

          console.warn(
            'API Base URL missing.'
          );

          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/services/apexrest/wallet/balance`,
          {
            idToken
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data?.success) {

          setWalletBalance(
            response.data.availableBalance || 0
          );

        } else {

          console.warn(
            response.data?.message ||
            'Wallet balance fetch failed.'
          );
        }

      } catch (err) {

        console.error(
          'Wallet Balance Error:',
          err.response?.data || err.message
        );

      } finally {

        setWalletLoading(false);
      }
    };

    fetchWalletBalance();

    const interval =
      setInterval(fetchWalletBalance, 5000);

    return () => clearInterval(interval);

  }, []);

  // ================================
  // CHECKOUT
  // ================================

  const handleCheckout = async () => {

    try {

      heavyTap();

      setLoading(true);

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {

        throw new Error(
          'User session expired. Please login again.'
        );
      }

      const idToken =
        await firebaseUser.getIdToken();

      if (!idToken) {

        throw new Error(
          'Authentication token missing.'
        );
      }

      if (!restData?.id) {

        throw new Error(
          'Restaurant reference missing.'
        );
      }

      const cartTotal = Number(totalPay);

      if (!cartTotal || cartTotal <= 0) {

        throw new Error(
          'Cart total is invalid.'
        );
      }

      console.log('Creating Order With:');

      console.log({
        restaurantId: restData.id,
        orderTotal: cartTotal,
        creditsUsed: walletApplied
      });

      const response = await axios.post(
        `${API_BASE_URL}/services/apexrest/order/create`,
        {
          idToken,
          restaurantId: restData.id,
          orderTotal: cartTotal,
          creditsUsed: Number(walletApplied)
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      if (!response.data?.success) {

        throw new Error(
          response.data?.message ||
          'Order creation failed.'
        );
      }

      const orderId =
        response.data.orderId;

      console.log(
        'Order Created Successfully:',
        orderId
      );

      navigate('/checkout', {
        state: {
          orderId,
          useWallet,
          computedWalletApplied: walletApplied,
          computedSubtotal: subtotal,
          computedTaxes: taxes,
          computedTotalPay: totalPay
        }
      });

    } catch (error) {

      console.error(
        'Order Creation Error:',
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        error.message
      );

    } finally {

      setLoading(false);
    }
  };



  // ================================
  // UI
  // ================================

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