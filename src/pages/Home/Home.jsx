import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import './Home.css';

/* ─── Mock Data ─── */
const USER_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsOHwxoJdRqvt1KTJIjuBMnjUaHgiksXnnUgjrmpBS0wd0xVeLXgJwm5dxcLg3Ch1mY36USOW8Y2r5wMpCNKnapaSogKpeZ1TIJs0b3Z5XshtP8tKhIFQn7nHAP9i4nEo0TCEFZS9RJ4vbQIzlpsLW9hJHoTgnEv8whF2w2-ZrZlhxAhmSxPjoS46LeeVmEfRq-x5lOsvRpmvoXtUZ4U-IdolXC4brRLSzHEuZ8N7PVQcsYF6XABAUTNtuGk7sR67Xp4gfXtHPBpZh';

const CATEGORIES = [
  { icon: 'restaurant', label: 'All', active: true },
  { icon: 'bakery_dining', label: 'Bakery' },
  { icon: 'local_pizza', label: 'Pizza' },
  { icon: 'set_meal', label: 'Sushi' },
  { icon: 'lunch_dining', label: 'Burgers' },
];

import sushiPlatter from '../../assets/images/sushi-platter.png';

/* Vibrant food imagery from various high-quality sources */
const IMG = {
  pasta:   'https://lh3.googleusercontent.com/aida-public/AB6AXuA7rRqrqQB8WlaPGEnNWpyhdP-PJiwWeP9SL--8b8mCFbqKRAp8ySZBcYOpWC_osbofXS3FhMghzEXj1WzAaysflWk79zTtw2OoN2T4ee7Pn11Vz1rp70xvF0DrnMANaRwY0eY_NkDxVjU6sWQZnxB2xST9n-j0F9KjFKd0_F3y0AAb6T6FGtcLSf9_fTcnrVht3s_SleVk3_bbyLHzFFgZfcamgnzB2vShoIxaY7XRlH3T-419ipyigS7bRFKP0kNFoG0G5NrpCN_K',
  grill:   'https://lh3.googleusercontent.com/aida-public/AB6AXuDRVg4WHeLML4GR_FT_Qw2vnFTiy1T2ux5QaExfnIcN-9F5ma-BjKPAo0Qw7V_C2vQqA3UsAkfzKR5h7oAGr5lT4FN9Nui8lhC2Qal40qJvGanldNT3FvbzyVUMbAkvSOoDmsMfY0QHgkZOjWPpEdWXjwQxDotyzhlPzhpK9rB3i9gL076JH9wnsX5SHq_NS0dEWW7UIs5a4TIM86doVTMv5orv5tGlXzV0OZFq8laVjkiJW3WSdzMBtaCEgOMGTfabbkykSkvUp17R',
  sushi:   sushiPlatter,
  burger:  'https://lh3.googleusercontent.com/aida-public/AB6AXuBIVLq7cg2DsY4Dw1Dv-N3mH1ev7hGiwMSEtAkMb41GEGZ3NWK7evAuqaBMyAPxKkiWfWKvgy0nDn19gJTl36RHd5hphjpBZEHwnD5zk20Xz3OOqpcEORX-TSKWVxR8Sq03vPIHUrMBpMSwfx8YauQJCYaM9mvF_O0B0wiiuU6A1tz_aSdynsxPxodhs5brxxdbojLh_t-ic0gUZNfT-lRUTmhxPYdl_r1BhB55YUDUtCc1hXK1RrtsjFHPykKJvwn2ChzHDcNNp9Px',
  dessert: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOhl1yjOKt_cFiqW9w_vcZMp1dEUEqSkIF_1PZ2iIkZrAMPdZWmq5nS0UsAxyiyLEANe-rPR00vzNRPE7gtW5F_ZxagryLxi0ew6lKQX3HlNyzqu5iDJHCJ5K-lyvjvro7takNhJHZXCemHKBQWECAbNr0M7UqsYN56Y7IwMX3szaterAKcLL9gjnTAhk1Z5X2ZjsrOEQUEbt_qilhyYQDuwE2oaBRpNEGotfphSL4XSiYM5zKYG8L2ce2Prupm8XZIwamR4fa9m0p',
  hero:    'https://lh3.googleusercontent.com/aida-public/AB6AXuBgH-b5tMofcESETTPskyBzLwfv0wmn3BssBWy4aqdG8Ssu1OA1zUF2-TkuMacuyuQnoamQ4yvmIXABcP0MXCPutGYk8oB8I0eJm2roL1mIa82SPjNwxdGCBvp-hLaPDfy6vfFwURop7N_5LTua6vyyS1iL9YkdjoWw2iRqqoXdIVu9Zy4-YBB6Tb5xwpsEoL6uinVUhgE1qmtfNs7FvVHc6EPMsF0VGJOSE0BB03Im-Zk1sn3MvqbVGgSt2rNNtIgASlsV6cwbEPIx',
  salad:   'https://lh3.googleusercontent.com/aida-public/AB6AXuBZH03LnZFjClUcB8auLGFe4iXGTZKPwtoc_7earTpfFLFpyJCZs0HnZvrIO9lRdlin_owGopgjo-eMqf8FxKWEdpRN11FShwLWF9Z7l7FV4qhusFk-YM9Ks3x-rR0l5pwRW6qQw9GcaCIK3IqOd9Nz0uQQzjdk9sAMRsSGOCpGXdvHjngM0ys6JcRfgZOyFuc2oxVMdee-vgSsOXFYq0vfqrhchkpb3dIRU1wD8DmpC7q6DlUQgQqjy4q2ZHuM5uOaqz6FmsWuOjuR',
  masala:  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2571&auto=format&fit=crop',
  tart:    'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2574&auto=format&fit=crop',
  pastry:  'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=2630&auto=format&fit=crop',
  cake:    'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=2536&auto=format&fit=crop',
};

const BANNERS = [
  {
    id: 1,
    supertitle: 'New Year Offer',
    title: '30% OFF',
    subtitle: '16 - 31 Dec',
    buttonText: 'Get Now',
    theme: 'green',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop', // Pizza
  },
  {
    id: 2,
    supertitle: 'Mid-Day Cravings',
    title: 'Free Delivery',
    subtitle: 'For spaghetti',
    buttonText: 'Order now',
    theme: 'dark',
    img: 'https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=2535&auto=format&fit=crop', // Spaghetti
  },
  {
    id: 3,
    supertitle: 'Daily Reward',
    title: 'Claim Your',
    subtitle: 'Free delivery now!',
    buttonText: 'Order now',
    theme: 'primary',
    img: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=2670&auto=format&fit=crop', // Burger/delivery
  },
  {
    id: 4,
    supertitle: 'Happy Hours',
    title: 'Buy 1 Get 1',
    subtitle: 'On premium sushi platters',
    buttonText: 'Explore',
    theme: 'slate',
    img: sushiPlatter,
  }
];

const TRENDING = [
  { img: IMG.dessert, badge: '#1 Trending',    name: 'Chocolate Lava Dream',  price: 'Starting at $9.99' },
  { img: IMG.pastry,  badge: 'Fresh Baked',    name: 'Glazed Berry Danish',   price: 'Starting at $5.99' },
  { img: IMG.tart,    badge: 'Delightful',     name: 'Summer Fruit Tart',     price: 'Starting at $12.99' },
  { img: IMG.cake,    badge: 'Limited Time',   name: 'Red Velvet Supreme',    price: 'Starting at $8.99' },
  { img: IMG.grill,   badge: 'Hot Seller',     name: 'Truffle Burger Series', price: 'Exclusive menu items' },
];

const RESTAURANTS = [
  {
    img: IMG.grill,
    name: 'The Luminary Grill',
    cuisine: 'Modern American',
    price: '$$$',
    distance: '2.4 mi',
    time: '25-35 min',
    rating: '4.8',
    reviews: '1.2k',
    offer: '20% OFF YOUR ORDER',
    offerColor: 'orange',
  },
  {
    img: IMG.masala,
    name: 'Masala Tango',
    cuisine: 'Indian Fusion',
    price: '$$',
    distance: '1.1 mi',
    time: '15-25 min',
    rating: '4.9',
    reviews: '800',
    offer: 'JUICY & SPICY SPECIAL',
    offerColor: 'orange',
  },
  {
    img: IMG.sushi,
    name: 'Sakura Omakase',
    cuisine: 'Japanese',
    price: '$$$$',
    distance: '3.2 mi',
    time: '30-40 min',
    rating: '4.9',
    reviews: '2.1k',
    offer: 'CHEF\'S TABLE SPECIAL',
    offerColor: 'orange',
  },
  {
    img: IMG.burger,
    name: 'Smokehouse BBQ Co.',
    cuisine: 'BBQ & Grill',
    price: '$$',
    distance: '0.8 mi',
    time: '20-30 min',
    rating: '4.7',
    reviews: '650',
    offer: 'BUY 1 GET 1 FREE',
    offerColor: 'indigo',
  },
  {
    img: IMG.salad,
    name: 'Green & Grain',
    cuisine: 'Mediterranean',
    price: '$$',
    distance: '1.5 mi',
    time: '15-20 min',
    rating: '4.8',
    reviews: '430',
    offer: 'NEW ON QUICK PLATE',
    offerColor: 'orange',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Home = () => {
  const { lightTap, mediumTap } = useHaptic();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('Recommended');
  const [currentBanner, setCurrentBanner] = useState(0);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5500); // changes every 5.5s
    return () => clearInterval(timer);
  }, []);

  // Filter & Sort Logic
  const filteredRestaurants = useMemo(() => {
    let result = RESTAURANTS;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
    }
    
    if (activeCategory !== 'All') {
      result = result.filter(r => {
        const c = r.cuisine.toLowerCase();
        if (activeCategory === 'Bakery') return c.includes('bakery') || c.includes('dessert') || r.name.toLowerCase().includes('sweet');
        if (activeCategory === 'Pizza') return c.includes('pizza') || c.includes('italian');
        if (activeCategory === 'Sushi') return c.includes('sushi') || c.includes('japanese');
        if (activeCategory === 'Burgers') return c.includes('burger') || c.includes('american') || c.includes('bbq');
        return true;
      });
    }

    if (activeSort === 'Rating') {
      result = [...result].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (activeSort === 'Delivery Time') {
      result = [...result].sort((a, b) => parseInt(a.time) - parseInt(b.time));
    }
    
    return result;
  }, [searchQuery, activeCategory, activeSort]);

  const filteredTrending = useMemo(() => {
    if (!searchQuery) return TRENDING;
    const q = searchQuery.toLowerCase();
    return TRENDING.filter(item => item.name.toLowerCase().includes(q) || item.badge.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div className="home-page">
      {/* ─── Header ─── */}
      <header className="home-header">
        <div className="home-header-top">
          <div className="home-location" onClick={() => { lightTap(); setIsAddressModalOpen(!isAddressModalOpen); setIsProfileModalOpen(false); }}>
            <div className="home-location-icon">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <span className="home-location-label">Deliver to</span>
              <h2 className="home-location-city">
                San Francisco, CA
                <motion.span 
                  className="material-symbols-outlined"
                  animate={{ rotate: isAddressModalOpen ? 180 : 0 }}
                >
                  expand_more
                </motion.span>
              </h2>
            </div>
          </div>
          <div className="home-avatar" onClick={() => { lightTap(); setIsProfileModalOpen(!isProfileModalOpen); setIsAddressModalOpen(false); }}>
            <img src={USER_IMG} alt="User Avatar" />
          </div>
        </div>

        {/* ─── Header Dropdowns ─── */}
        <AnimatePresence>
          {isAddressModalOpen && (
            <motion.div
              className="home-address-dropdown dropdown-glass"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="address-slot active" onClick={() => { lightTap(); setIsAddressModalOpen(false); }}>
                <div className="address-icon"><span className="material-symbols-outlined">home</span></div>
                <div className="address-details">
                  <h4>Home (Default)</h4>
                  <p>123 Silicon Valley, SF, CA</p>
                </div>
                <span className="material-symbols-outlined check">check_circle</span>
              </div>
              <div className="address-slot" onClick={() => { lightTap(); setIsAddressModalOpen(false); }}>
                <div className="address-icon"><span className="material-symbols-outlined">work</span></div>
                <div className="address-details">
                  <h4>Office</h4>
                  <p>456 Market St, SF, CA</p>
                </div>
              </div>
              <button className="address-add-btn" onClick={mediumTap}>
                <span className="material-symbols-outlined">add</span>
                Add new address
              </button>
            </motion.div>
          )}
          
          {isProfileModalOpen && (
            <motion.div
              className="home-profile-dropdown dropdown-glass"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="profile-header">
                <div className="profile-img-large">
                  <img src={USER_IMG} alt="User" />
                </div>
                <div className="profile-info">
                  <h4>Hey, Foodie!</h4>
                  <p>Your Orders & Details</p>
                </div>
              </div>
              <div className="profile-menu">
                <button onClick={() => { setIsProfileModalOpen(false); lightTap(); navigate('/profile'); }}>
                  <span className="material-symbols-outlined">person</span> My Profile
                </button>
                <button onClick={() => { setIsProfileModalOpen(false); lightTap(); navigate('/favorites'); }}>
                  <span className="material-symbols-outlined">favorite</span> Favorites
                </button>
                <div className="dropdown-divider"></div>
                <button className="logout-btn" onClick={() => { setIsProfileModalOpen(false); mediumTap(); navigate('/landing'); }}>
                  <span className="material-symbols-outlined">logout</span> Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="home-search-wrap">
          <div className="home-search">
            <span className="material-symbols-outlined">search</span>
            <input
              className="home-search-input"
              type="text"
              placeholder="Search restaurants, dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="home-search-filter" onClick={() => { mediumTap(); setIsFilterOpen(true); }}>
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Hero Carousel Banner ─── */}
        <motion.section
          className="home-hero-carousel"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="home-banner-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                className={`home-banner-card theme-${BANNERS[currentBanner].theme}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div className="home-banner-bg-img">
                   <img src={BANNERS[currentBanner].img} alt="" />
                </div>
                <div className="home-banner-content">
                  <div>
                    <span className="home-banner-supertitle">{BANNERS[currentBanner].supertitle}</span>
                    <h1 className="home-banner-title">{BANNERS[currentBanner].title}</h1>
                    <p className="home-banner-subtitle">{BANNERS[currentBanner].subtitle}</p>
                  </div>
                  <button className="home-banner-btn" onClick={lightTap}>
                    {BANNERS[currentBanner].buttonText}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="home-banner-dots">
              {BANNERS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`home-banner-dot ${idx === currentBanner ? 'active' : ''}`} 
                  onClick={() => { lightTap(); setCurrentBanner(idx); }}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Categories ─── */}
        <motion.section
          className="home-categories"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="home-cat-item"
              onClick={() => { setActiveCategory(cat.label); lightTap(); }}
            >
              <div className={`home-cat-icon ${activeCategory === cat.label ? 'active' : 'inactive'}`}>
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <span className={`home-cat-label ${activeCategory === cat.label ? 'active' : 'inactive'}`}>
                {cat.label}
              </span>
            </div>
          ))}
        </motion.section>

        {/* ─── Trending Now ─── */}
        <motion.section
          className="home-trending"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <div className="home-section-header">
            <h2 className="home-section-title">Trending Now</h2>
            <button className="home-section-action" onClick={lightTap}>
              View Heatmap <span className="material-symbols-outlined">trending_up</span>
            </button>
          </div>
          <div className="home-trending-scroll">
            <AnimatePresence>
              {filteredTrending.map((item) => (
                <motion.div
                  key={item.name}
                  className="home-trending-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="home-trending-img">
                    <img src={item.img} alt={item.name} />
                    <div className="home-trending-badge">{item.badge}</div>
                  </div>
                  <h4 className="home-trending-name">{item.name}</h4>
                  <p className="home-trending-price">{item.price}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ─── Premium Selections ─── */}
        <motion.section
          className="home-premium"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <div className="home-section-header" style={{ padding: 0, marginBottom: '1.25rem' }}>
            <h2 className="home-section-title">Premium Selections</h2>
            <button className="home-section-action" onClick={lightTap} style={{ color: '#94A3B8' }}>
              See all
            </button>
          </div>

          <motion.div className="home-premium-list" layout>
            <AnimatePresence>
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((r) => (
                  <motion.div
                    key={r.name}
                    className="home-restaurant-card"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="home-restaurant-img">
                      <img src={r.img} alt={r.name} />
                      <div className={`home-offer-badge ${r.offerColor === 'indigo' ? 'indigo' : ''}`}>
                        {r.offer}
                      </div>
                      <div className="home-rating-badge">
                        <span className="material-symbols-outlined">star</span>
                        <span className="home-rating-score">{r.rating}</span>
                        <span className="home-rating-count">({r.reviews})</span>
                      </div>
                    </div>
                    <div className="home-restaurant-info">
                      <div>
                        <h3 className="home-restaurant-name">{r.name}</h3>
                        <p className="home-restaurant-meta">
                          {r.cuisine}
                          <span className="home-restaurant-dot" />
                          {r.price}
                          <span className="home-restaurant-dot" />
                          {r.distance}
                        </p>
                      </div>
                      <div className="home-time-badge">
                        <span className="material-symbols-outlined">schedule</span>
                        <span>{r.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="home-empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="material-symbols-outlined">search_off</span>
                  <h3>No matches found</h3>
                  <p>Try adjusting your search or filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* ─── Smart Protection ─── */}
        <motion.section
          className="home-protection"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <div className="home-protection-card">
            <div className="home-protection-icon">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div>
              <h4 className="home-protection-title">Smart Protection</h4>
              <p className="home-protection-desc">Powered by real-time tracking and automated seamless refund flows.</p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ─── Bottom Navigation ─── */}
      <nav className="home-bottom-nav">
        <div className="home-bottom-nav-inner">
          <Link to="/home" className="home-nav-item active" onClick={lightTap}>
            <span className="material-symbols-outlined">home</span>
            <span className="home-nav-label">Home</span>
          </Link>
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">explore</span>
            <span className="home-nav-label">Discover</span>
          </Link>
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="home-nav-badge" />
            </div>
            <span className="home-nav-label">Orders</span>
          </Link>
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">person</span>
            <span className="home-nav-label">Profile</span>
          </Link>
        </div>
      </nav>

      {/* ─── Filter Bottom Sheet Modal ─── */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              className="filter-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div 
              className="filter-modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="filter-drag-handle" />
              <div className="filter-header">
                <h3>Filter & Sort</h3>
                <button className="filter-close-btn" onClick={() => { setIsFilterOpen(false); lightTap(); }}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="filter-section">
                <h4>Sort By</h4>
                <div className="filter-chips">
                  {['Recommended', 'Rating', 'Delivery Time'].map(sort => (
                    <button 
                      key={sort} 
                      className={`filter-chip ${activeSort === sort ? 'active' : ''}`}
                      onClick={() => { setActiveSort(sort); lightTap(); }}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="filter-chips">
                  {['$', '$$', '$$$', '$$$$'].map(price => (
                    <button key={price} className="filter-chip">{price}</button>
                  ))}
                </div>
              </div>

              <div className="filter-actions">
                <button 
                  className="filter-apply-btn"
                  onClick={() => { setIsFilterOpen(false); mediumTap(); }}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
