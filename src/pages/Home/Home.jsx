import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
};

const TRENDING = [
  { img: IMG.pasta,   badge: '#1 Trending',    name: 'Artisan Pasta Night',   price: 'Starting at $14.99' },
  { img: IMG.grill,   badge: 'Limited Time',    name: 'Truffle Burger Series', price: 'Exclusive menu items' },
  { img: IMG.sushi,   badge: 'Chef\'s Pick',    name: 'Omakase Experience',    price: 'Starting at $29.99' },
  { img: IMG.dessert, badge: 'New Arrival',     name: 'Chocolate Lava Dream',  price: 'Starting at $9.99' },
  { img: IMG.salad,   badge: 'Healthy Choice',  name: 'Mediterranean Bowl',    price: 'Starting at $12.49' },
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
  const { lightTap } = useHaptic();
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="home-page">
      {/* ─── Header ─── */}
      <header className="home-header">
        <div className="home-header-top">
          <div className="home-location">
            <div className="home-location-icon">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <span className="home-location-label">Deliver to</span>
              <h2 className="home-location-city">
                San Francisco, CA
                <span className="material-symbols-outlined">expand_more</span>
              </h2>
            </div>
          </div>
          <div className="home-avatar">
            <img src={USER_IMG} alt="User" />
          </div>
        </div>

        <div className="home-search-wrap">
          <div className="home-search">
            <span className="material-symbols-outlined">search</span>
            <input
              className="home-search-input"
              type="text"
              placeholder="Search restaurants, dishes..."
            />
            <button className="home-search-filter" onClick={lightTap}>
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Hero Banner ─── */}
        <motion.section
          className="home-hero"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="home-hero-card">
            <img src={IMG.hero} alt="Delicious food" />
            <div className="home-hero-overlay" />
            <div className="home-hero-content">
              <div>
                <h1 className="home-hero-title">
                  Delivered hot.<br />Delivered fast.
                </h1>
                <p className="home-hero-subtitle">Premium eats from your favorite spots.</p>
              </div>
              <button className="home-hero-btn" onClick={lightTap}>Order Now</button>
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
            {TRENDING.map((item, i) => (
              <div key={i} className="home-trending-card">
                <div className="home-trending-img">
                  <img src={item.img} alt={item.name} />
                  <div className="home-trending-badge">{item.badge}</div>
                </div>
                <h4 className="home-trending-name">{item.name}</h4>
                <p className="home-trending-price">{item.price}</p>
              </div>
            ))}
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

          <div className="home-premium-list">
            {RESTAURANTS.map((r, i) => (
              <div key={i} className="home-restaurant-card">
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
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default Home;
