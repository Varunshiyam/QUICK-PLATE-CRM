import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import useAppStore from '../../store/useAppStore';
import './Restaurant.css';

/* ─── Mock Data ─── */
const RESTAURANT_INFO = {
  name: "L'Artisan Bistro",
  rating: '4.8',
  time: '25-35 min',
  price: '$$$',
  heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzYy1O0IhJQ6uGpDIrOekF2Rwvg9RtlU1kT5RQySq78ffXqE8hjUiKalqrZ-CLe7iFY9QTG3PzP9YMiEfB8Tkx-ua7olhZkA-tWcEua7YVGmBK0HvKJqhDCSeghzmUO2-Ke-D60bTmVgECUQqG_zl_UGYmQnh7DYjZG-SbYt7GXjJSXZTVivXl7c_HySy5ud0YpnApwGLBQYUvxr2dT9rMh3WCIBQuFSj1heu7HDBAFihyfmGJLT7B4M049b87iZvhH4AW8iyQutSy',
};

const MENU = [
  {
    category: 'Starters',
    items: [
      {
        id: 's1',
        title: 'Truffle Arancini',
        desc: 'Crispy risotto balls with black truffle and creamy mozzarella center, served with aioli.',
        price: '$14.50',
        badge: 'Best Seller',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjwEpPRsX2oywWFqtPNcPKzb1X5iwH24IcDbP7QOa7eClnwxu4C2Kq90vDcauGrPq_3gdrIJ477pGBQToGa7wCIsB5NnftzpbX3_aI7jbmqEFKX1UDDQ4rNlUV4P82TEg69n0MF_z5pCP8iefUzrMYod_pfFQKCFDg-GtrNEl8vqQ1_GenmxgTFL590ChSTobs_XfGQDuWw88yvNd5ZiNrOyqcwC62SboIigM2RVtHcREHcytxe6S80TFHdcX6P9HOoEEgKwJsnf1J'
      },
      {
        id: 's2',
        title: 'Honey Glazed Burrata',
        desc: 'Fresh burrata cheese with roasted peaches, wildflower honey, and toasted sourdough slices.',
        price: '$18.00',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFqf3Uw80jTfd-TlsEg6Us_7pcKCgnKcpKJC28r-d-Z1P7M2jA6nwLpV2MG1EhZNl-F37DUeZ7fwIvA5YSNfaQqEuvGDW6odvEWNBpcnyhL_o_NDUJvV7r3UA9dTN3lUkfFlLlry9HLUOQc_ZKWmHq48ZD87ic8Qlg44jApHMgdzTxZL7qSzgLoVGACKc8e1cbDxl3a4daT4JIsGBwSvT0rfVkgHexKkiNcksk_QrS9YfLt7tIWcsgBnRcarr-CYM6GggphJ0Acq1l'
      },
    ]
  },
  {
    category: 'Main Course',
    items: [
      {
        id: 'm1',
        title: 'Pan-Seared Salmon',
        desc: 'Atlantic salmon with lemon-butter caper sauce, served over garlic smashed potatoes.',
        price: '$28.50',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM49kjtWyF_X6bISKJosRIuEFsDKMlewVMyR-DkAt8dPPSNYFEQf_D52iEp7ZLRmh238M8KzfoPbhDZL_iCXfCppnp7qhsMB6gvqdqdDYSHaI8rXkVEYvULo2ro2YPmQ-4bWzcALfA4hIzF1T_gnfFnij-vAVz4XR2XyViooaMFfucSPKw9xApe7fvhwR7hxmPZR7Z1B9NcWeVcFSXHiX-xumFvx9lZjtrkWAyfg7dl0KFAjTayzvM8aRZ2oe1yuyzpDYm6MOoMQ_U'
      },
      {
        id: 'm2',
        title: 'Wild Mushroom Risotto',
        desc: 'Slow-cooked Arborio rice with porcini mushrooms, parmesan, and a drizzle of herb oil.',
        price: '$22.00',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZe0Srfj1Vjs22qtsXtBBYCqCHwGZh35bJnkCoGnPgPtVsJDB4zPht2J_8iHYTUhrDxMkBts5k2m07oGkoefbZ-EXJpDVI6jh9t2hm78pDeeSneMrP89AxiIMkP0sLSdUltCT9ECv6And9ZHTpYSrRKE61VaOmnoIeSWxSHMC4BgE7jGYrG3_PtsS-34YzfwdFXXJsxLLfTaFNr4Y3KaIoquFHjI2B6PZn_fL44LXAsVxWdE3w-TbJBm1IKPvC8AQsa-nBoAs7eqlY'
      },
    ]
  },
  {
    category: 'Desserts',
    items: [
      {
        id: 'd1',
        title: 'Classic Tiramisu',
        desc: 'Espresso-soaked ladyfingers layered with sweet mascarpone cream and cocoa dust.',
        price: '$12.00',
        img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=2574&auto=format&fit=crop'
      }
    ]
  },
  {
    category: 'Beverages',
    items: [
      {
        id: 'b1',
        title: 'Midnight Mojito',
        desc: 'Signature dark rum blended with fresh mint, lime, and crushed blackberries.',
        price: '$11.00',
        img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop'
      }
    ]
  }
];

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
  const [activeTab, setActiveTab] = useState('Starters');
  
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
