import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import useAppStore from '../../store/useAppStore';
import './Restaurant.css';

import { getRestaurantMenu } from '../../data/mockMenus';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Restaurant = () => {
  const { lightTap, mediumTap } = useHaptic();
  const navigate = useNavigate();
  const location = useLocation();
  const restaurantData = location.state?.restaurant || {
    name: "L'Artisan Bistro",
    rating: '4.8',
    time: '25-35 min',
    price: '$$$',
    cuisine: 'Modern American',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzYy1O0IhJQ6uGpDIrOekF2Rwvg9RtlU1kT5RQySq78ffXqE8hjUiKalqrZ-CLe7iFY9QTG3PzP9YMiEfB8Tkx-ua7olhZkA-tWcEua7YVGmBK0HvKJqhDCSeghzmUO2-Ke-D60bTmVgECUQqG_zl_UGYmQnh7DYjZG-SbYt7GXjJSXZTVivXl7c_HySy5ud0YpnApwGLBQYUvxr2dT9rMh3WCIBQuFSj1heu7HDBAFihyfmGJLT7B4M049b87iZvhH4AW8iyQutSy'
  };

  const { menu: MENU, heroBg: heroImg, restaurantBanners } = getRestaurantMenu(restaurantData);
  const RESTAURANT_INFO = { ...restaurantData, heroImg };

  const [activeTab, setActiveTab] = useState(MENU[0]?.category || 'Starters');
  
  // Section refs for smooth scrolling calculation mapping
  const sectionRefs = useRef({});

  const scrollToSection = (category) => {
    lightTap();
    setActiveTab(category);
    // Add real scroll logic ideally here, for now it shifts states visually cleanly.
  };

  return (
    <div className="rest-page">
      {/* ─── Hero Image Section ─── */}
      <div className="rest-hero">
        <div 
          className="rest-hero-bg"
          style={{ backgroundImage: `url('${RESTAURANT_INFO.heroImg}')` }}
        />
        <div className="rest-hero-overlay" />
        
        {/* Top Actions */}
        <div className="rest-hero-top">
          <button className="rest-glass-btn" onClick={() => { mediumTap(); navigate(-1); }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          <div className="rest-top-actions">
            <button className="rest-glass-btn" onClick={lightTap}>
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="rest-glass-btn" onClick={lightTap}>
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        {/* Hero Info Details */}
        <div className="rest-hero-bottom">
          <motion.h1 
            className="rest-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {RESTAURANT_INFO.name}
          </motion.h1>
          <motion.div 
            className="rest-meta"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="rest-rating">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }}>star</span>
              {RESTAURANT_INFO.rating}
            </div>
            <span className="rest-meta-text">• {RESTAURANT_INFO.time} • {RESTAURANT_INFO.price}</span>
          </motion.div>
        </div>
      </div>

      {/* ─── Restaurant Banner ─── */}
      {restaurantBanners && restaurantBanners.length > 0 && (
        <div className="rest-banner-section">
          {restaurantBanners.map((banner) => (
            <div key={banner.id} className={`rest-banner-card theme-${banner.theme}`}>
              <div className="rest-banner-bg-img">
                 <img src={banner.img} alt="" />
              </div>
              <div className="rest-banner-content">
                <div>
                  <span className="rest-banner-supertitle">{banner.supertitle}</span>
                  <h1 className="rest-banner-title">{banner.title}</h1>
                  <p className="rest-banner-subtitle">{banner.subtitle}</p>
                </div>
                <button className="rest-banner-btn" onClick={lightTap}>
                  {banner.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Sticky Tab Bar ─── */}
      <div className="rest-tabs">
        {MENU.map((section) => (
          <button 
            key={section.category}
            className={`rest-tab-item ${activeTab === section.category ? 'active' : ''}`}
            onClick={() => scrollToSection(section.category)}
          >
            <span className="rest-tab-text">{section.category}</span>
            <div className="rest-tab-indicator" />
          </button>
        ))}
      </div>

      {/* ─── Menu Items Flow ─── */}
      <div className="rest-content">
        {MENU.map((section, sectionIdx) => (
          <motion.div 
            key={section.category}
            className="rest-section"
            ref={(el) => (sectionRefs.current[section.category] = el)}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={0.1}
          >
            <h2 className="rest-section-title">{section.category}</h2>
            
            <div className="rest-menu-list">
              {section.items.map((item, itemIdx) => (
                <div key={item.id} className="rest-menu-card">
                  
                  <div className="rest-menu-info">
                    {item.badge && (
                      <div className="rest-badge">
                        <span className="material-symbols-outlined">circle</span>
                        <span className="rest-badge-text">{item.badge}</span>
                      </div>
                    )}
                    <h3 className="rest-item-title">{item.title}</h3>
                    <p className="rest-item-desc">{item.desc}</p>
                    <div className="rest-item-price">{item.price}</div>
                  </div>

                  <div className="rest-menu-img-wrap">
                    <img src={item.img} alt={item.title} />
                    <button className="rest-add-btn" onClick={mediumTap}>
                      ADD <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Floating View Cart Action ─── */}
      <motion.div 
        className="rest-floating-cart"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, type: 'spring', bounce: 0.3 }}
      >
        <button className="rest-cart-btn" onClick={() => mediumTap()}>
          <div className="rest-cart-left">
            <span className="rest-cart-badge">2 Items</span>
            <span className="rest-cart-action">• View Cart</span>
          </div>
          <span className="rest-cart-price">$32.50</span>
        </button>
      </motion.div>

      {/* ─── Sticky Bottom Navigation ─── */ }
      <nav className="rest-bottom-nav glass-nav-override">
        <div className="rest-nav-inner">
          <Link to="/home" className="rest-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined nav-icon">home</span>
            <span className="nav-label">Home</span>
          </Link>
          <div className="rest-nav-item">
            <span className="material-symbols-outlined nav-active nav-icon fill-1">restaurant_menu</span>
            <span className="nav-label nav-active">Menu</span>
            <div className="nav-dot" />
          </div>
          <div className="rest-nav-item">
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined nav-icon">receipt_long</span>
              <div className="nav-badge" />
            </div>
            <span className="nav-label">Orders</span>
          </div>
          <Link to="/profile" className="rest-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined nav-icon">person</span>
            <span className="nav-label">Profile</span>
          </Link>
        </div>
      </nav>

    </div>
  );
};

export default Restaurant;
