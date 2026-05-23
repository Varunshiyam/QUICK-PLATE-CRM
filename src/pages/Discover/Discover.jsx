import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import useAppStore from '../../store/useAppStore';
import { getStoredUser } from '../../services/firebase';
import { fetchRestaurants } from '../../services/restaurantService';
import toast from 'react-hot-toast';
import '../Home/Home.css';
import './Discover.css';

import sakuraDiscoverImg from '../../assets/images/Discover_Page_Pic/Sakura Omakase_Discover.webp';
import smokeHouseDiscoverImg from '../../assets/images/Discover_Page_Pic/Smoke_House_Discover.webp';

/* ─── Mock Data ─── */
// Same fake URLs used in mockup
const IMG = {
  salad: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDly0cFcsU8pQ_CRHCHdUXLONKQomM3JfJp6IidfVRzTCpG-RtXxbwuvQmiA9fLmRth_ursoL7wa9eSaIsE_7owRWI3lwJDvPH6mC8BRkmOxiKrBV58SClxX6I9zt7Tiw_pLW3h9Jr-K0JbUSipRWQAtn90jhK7is8Sjg91qAQAiXzVxhVzUYpTVp5tCMDD_hW_DsaDJ7E2QqzsYxRCZz8b78zZHfAig6LqFR61i1lYjJFtR0UEteQhtNMoruOtiMc1fQegztMTewi-',
  burger: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuj7nBSiFB1nlNSpTqO6wEOT_Cf6caYRc0kI2arSrpOMKI13n6mdSEAjNxd0w3YlSJyO3chy60sa2taSsirFB37XeIbCDpCXoMwxH5QWdCp-Gfn46bO4uYQV3DOvDDQa_RLw6akJkPu9cDuduC9FZEprbl6DWSjKIQqjNndFaY7w2wdZkzQIZyzuuQDSdQ45_nk28PQGBbRc1vgO_xSV--mw5-0tyS-wImBz2Hq0NM0o7orZAnm6iuJTuqWYOUriA71L_kZhcjtN7Y',
  friday: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvmLNQLxl-_2eEo2ZaxcLOoLbij4p8yLadYQPdi_JLjt3E65ybZbaVScmI4W9kAoN_HC0TP93hfI-D9c9cVSFR6skh4Fm8CgWIbdMQz0-JdyVI0UWa2fJPAkWjQzx7IUp5mMvpRvAmMKp4BnbNkxvJnHT0phBb5rbC8EmXl_4SOTTeSX1g8zSM5NV6h_aFMMZ4BnSYSBWIWwwae94lOP2M8Iq7gOf1prBo-k19802VDCycqk46d0vC1sMP1E8sVjF54a9VTnYxBs0R',
  pizza: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFUjFi4U6493la3GUcriAAbZwX-AWxsdBXg_udwUGiEodx-q2vbsMLbjjCcuDnkwuLYXak8tSvk7ZcFfn1fD8VMJp7XiNqORA_4I1AI_TKqhS-wgTCndWel-3USUrmqxytxMCI7bg7d5vsBdMo-XZYMivWDRDCIyBOmX-oKEhJUzLhDdfMeUtqlesrh3PCJaQjHslygdSNSoqsc88a5ph1hsOa1U2R2C_1WP5r2H_jmfcaGUZtZIb3n0Q8hBgup16jkm1L5vJElBhq',
  taco: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoUQTaRYRG-FcaW4HCCctHggtQMSwHCfRPGFWYKo3seavcLqlQk-DxuNwBeqpQ0DUBID1Fv5DlwROpMbFcAFHIjCIKMOMiCVDrZKfJJ8CuCA36wIOYfoWs3psbOG1qKJav8U90PKDwbmuw9Q8EoUUFAH9fp5CI8CumtMjd-eyVK-0a4AxrwsJlrcuc0o5gwH6TSHI2mt38Ku_7KNdmqR23cIMevBJOdddp9z9nkO-mgDUDJ-epYd2NzcoWiTrNewCkL3abQlgp69ET',
};

const RESTAURANT_METADATA = {
  'The Luminary Grill': { cuisine: 'Modern American', price: '$$$', distance: '2.4 mi', time: '25-35 min', rating: '4.8', reviews: '1.2k', offer: '20% OFF YOUR ORDER', offerColor: 'orange' },
  'Masala Tango': { cuisine: 'Indian Fusion', price: '$$', distance: '1.1 mi', time: '15-25 min', rating: '4.9', reviews: '800', offer: 'JUICY & SPICY SPECIAL', offerColor: 'orange' },
  'Sakura Omakase': { cuisine: 'Japanese', price: '$$$$', distance: '3.2 mi', time: '30-40 min', rating: '4.9', reviews: '2.1k', offer: "CHEF'S TABLE SPECIAL", offerColor: 'orange' },
  'Smokehouse BBQ Co.': { cuisine: 'BBQ & Grill', price: '$$', distance: '0.8 mi', time: '20-30 min', rating: '4.7', reviews: '650', offer: 'BUY 1 GET 1 FREE', offerColor: 'indigo' },
  'Green & Grain': { cuisine: 'Mediterranean', price: '$$', distance: '1.5 mi', time: '15-20 min', rating: '4.8', reviews: '430', offer: 'NEW ON QUICK PLATE', offerColor: 'orange' },
  'Morning Bliss Bakery': { cuisine: 'Bakery & Pastry', price: '$$', distance: '0.9 mi', time: '15-25 min', rating: '4.9', reviews: '1.5k', offer: 'FRESH OUT THE OVEN', offerColor: 'orange' },
  'Sweet Tooth Confections': { cuisine: 'Desserts & Cakes', price: '$$$', distance: '1.2 mi', time: '20-30 min', rating: '4.8', reviews: '950', offer: 'BUY 1 GET 1 HALF OFF', offerColor: 'indigo' },
  'Napoli Woodfired Pizza': { cuisine: 'Italian Pizza', price: '$$', distance: '1.8 mi', time: '25-40 min', rating: '4.7', reviews: '3.2k', offer: 'FREE GARLIC KNOTS', offerColor: 'orange' },
  'Slice & Stone': { cuisine: 'Pizza', price: '$$$', distance: '2.1 mi', time: '30-45 min', rating: '4.9', reviews: '2.8k', offer: '20% OFF PREMIUM', offerColor: 'indigo' },
  'Zen Sushi Lounge': { cuisine: 'Japanese Sushi', price: '$$$$', distance: '3.5 mi', time: '35-50 min', rating: '4.9', reviews: '1.1k', offer: 'COMPLIMENTARY MISO', offerColor: 'orange' },
  'Tokyo Nights Rollhous': { cuisine: 'Japanese', price: '$$$', distance: '1.4 mi', time: '20-35 min', rating: '4.8', reviews: '890', offer: 'LATE NIGHT DEALS', offerColor: 'indigo' },
  'Tokyo Nights Rollhouse': { cuisine: 'Japanese', price: '$$$', distance: '1.4 mi', time: '20-35 min', rating: '4.8', reviews: '890', offer: 'LATE NIGHT DEALS', offerColor: 'indigo' },
  'Smash & Stack Burgers': { cuisine: 'American Burgers', price: '$$', distance: '0.6 mi', time: '15-20 min', rating: '4.6', reviews: '4.5k', offer: 'FREE FRIES W/ COMBO', offerColor: 'orange' },
  'The Meltdown Grill': { cuisine: 'American BBQ', price: '$$$', distance: '1.9 mi', time: '25-30 min', rating: '4.8', reviews: '750', offer: 'DOUBLE CHEESE FREE', offerColor: 'indigo' }
};

const CATEGORIES = [
  { icon: 'local_fire_department', label: 'Trending' },
  { icon: 'potted_plant', label: 'Healthy' },
  { icon: 'lunch_dining', label: 'Fast Food' },
  { icon: 'bakery_dining', label: 'Bakery' },
];

const EXCLUSIVE_OFFERS = [
  { img: IMG.friday, badge: '50% OFF', title: 'Friday Feast', subtitle: 'Valid on all luxury dining partners' },
  { img: IMG.pizza, badge: 'BOGO', title: 'Pizza Nights', subtitle: 'Buy one get one free every evening' },
  { img: IMG.taco, badge: 'FREE DELIVERY', title: 'Taco Fiesta', subtitle: 'Zero delivery fees all weekend' },
];

const NEW_ON_QUICK_PLATE = [
  {
    name: "Green & Grain",         // Actual restaurant name to search for
    alias: "Zest & Zestful Bowls",
    img: IMG.salad,
    rating: "4.9",
    time: "15-20 min",
    cuisine: "Salads • Healthy • Vegan",
  },
  {
    name: "Smash & Stack Burgers",  // Actual restaurant name
    alias: "Melt Burger Lab",
    img: IMG.burger,
    rating: "4.7",
    time: "25-35 min",
    cuisine: "Burgers • American • Fast Food",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Discover = () => {
  const { lightTap, mediumTap } = useHaptic();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Trending');
  
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants();
        const mappedData = data.map(r => {
          let mappedImg = r.img;
          if (r.name.includes("Sakura") || r.name.includes("Omakase")) mappedImg = sakuraDiscoverImg;
          else if (r.name.includes("Smokehouse") || r.name.includes("Smoke House")) mappedImg = smokeHouseDiscoverImg;
          else if (r.name.includes("Green & Grain")) mappedImg = IMG.salad;
          else if (r.name.includes("Smash & Stack")) mappedImg = IMG.burger;
          else if (r.name.includes("Morning Bliss")) mappedImg = IMG.pizza; 
          else if (r.name.includes("Napoli")) mappedImg = IMG.pizza;
          else if (r.name.includes("Slice & Stone")) mappedImg = IMG.pizza;
          else if (r.name.includes("Meltdown")) mappedImg = IMG.burger;
          else if (r.name.includes("Tokyo")) mappedImg = IMG.salad;
          else if (r.name.includes("Zen Sushi")) mappedImg = IMG.salad;
          else if (r.name.includes("Sweet Tooth")) mappedImg = IMG.friday;
          else if (!mappedImg) mappedImg = IMG.salad;

          const matchKey = Object.keys(RESTAURANT_METADATA).find(key => r.name.includes(key) || key.includes(r.name));
          const meta = matchKey ? RESTAURANT_METADATA[matchKey] : {};

          return {
            id: r.id || r.Id,
            name: r.name,
            img: mappedImg,
            cuisine: meta.cuisine || r.city || 'Local',
            price: meta.price || '$$',
            distance: meta.distance || '1.5 mi',
            time: meta.time || (r.avgPrepTime ? `${r.avgPrepTime} min` : '20-30 min'),
            rating: meta.rating || '4.8',
            reviews: meta.reviews || '500+',
            offer: meta.offer || 'FRESH SPECIAL',
            offerColor: meta.offerColor || 'orange'
          };
        });
        setRestaurants(mappedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
        setIsLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  const { getCartItemCount } = useAppStore();
  const cartItemCount = getCartItemCount();
  
  const storedUser = getStoredUser();
  const deliveryAddress = storedUser?.address || 'KCE, Coimbatore';

  const handleNavigateToRestaurant = (restaurantObj) => {
    if (restaurantObj) {
      navigate('/restaurant', { state: { restaurant: restaurantObj } });
    } else {
      toast("Restaurant is currently unavailable.");
    }
  };

  const newOnQuickPlate = restaurants.filter(r => 
    r.name.includes("Sakura") || r.name.includes("Omakase") ||
    r.name.includes("Smokehouse") || r.name.includes("Smoke House") ||
    r.name.includes("Smash & Stack")
  ).slice(0, 3);
  
  if (newOnQuickPlate.length < 3 && restaurants.length > 0) {
    newOnQuickPlate.push(...restaurants.filter(r => !newOnQuickPlate.includes(r)).slice(0, 3 - newOnQuickPlate.length));
  }
  
  const searchResults = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categoryRestaurants = restaurants.filter((r) => {
  const text = `${r.name} ${r.cuisine}`.toLowerCase();

  if (activeCategory === 'Trending') {
    return r.rating >= 4.8 || text.includes('japanese') || text.includes('pizza');
  }

  if (activeCategory === 'Healthy') {
    return text.includes('healthy') || text.includes('salad') || text.includes('vegan') || text.includes('mediterranean') || text.includes('green');
  }

  if (activeCategory === 'Fast Food') {
    return text.includes('burger') || text.includes('pizza') || text.includes('fast food') || text.includes('american');
  }

  if (activeCategory === 'Bakery') {
    return text.includes('bakery') || text.includes('pastry') || text.includes('dessert') || text.includes('cake');
  }

  return true;
});

const displayList = searchQuery ? searchResults : categoryRestaurants;

  return (
    <div className="discover-page">
      {/* ─── Header ─── */}
      <header className="home-header">
        <div className="home-header-top">
          <div className="home-location" onClick={lightTap}>
            <div className="home-location-icon" style={{ borderRadius: '50%', background: 'rgba(249, 127, 26, 0.1)', color: '#f97f1a', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <span className="home-location-label" style={{ fontSize: '12px', color: '#64748b' }}>Deliver to</span>
              <h2 className="home-location-city" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {deliveryAddress.length > 25 ? `${deliveryAddress.substring(0, 25)}...` : deliveryAddress}
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#f97f1a' }}>expand_more</span>
              </h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="discover-icon-btn" onClick={() => { lightTap(); setIsSearchOpen(!isSearchOpen); }}>
              <span className="material-symbols-outlined">{isSearchOpen ? 'close' : 'search'}</span>
            </div>
            <div className="discover-icon-btn home-cart-icon" onClick={() => { lightTap(); navigate('/cart'); }}>
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="home-search-wrap" style={{ padding: '0 1rem 1rem' }}>
                <div className="home-search">
                  <span className="material-symbols-outlined">search</span>
                  <input
                    className="home-search-input"
                    type="text"
                    placeholder="Search restaurants, dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button className="home-search-filter" onClick={() => { mediumTap(); setSearchQuery(''); }}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="discover-main">
        {/* Sticky Categories */}
        <div className="discover-categories hide-scrollbar">
          <div className="discover-categories-inner">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { lightTap(); setActiveCategory(cat.label); }}
                className={`discover-cat-btn ${activeCategory === cat.label ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Conditional Render */}
        {!searchQuery ? (
          <>
            {/* Exclusive Offers Carousel */}
            <motion.section 
              className="discover-section"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              <div className="discover-section-header">
                <h2 className="discover-section-title">Exclusive Offers</h2>
                <button className="discover-section-action" onClick={lightTap}>View All</button>
              </div>
              <div className="discover-offers-scroll hide-scrollbar">
                {EXCLUSIVE_OFFERS.map((offer, idx) => (
                  <div key={idx} className="discover-offer-card">
                    <div 
                      className="discover-offer-bg" 
                      style={{ backgroundImage: `url('${offer.img}')` }}
                    ></div>
                    <div className="discover-offer-overlay"></div>
                    <div className="discover-offer-badge">
                      {offer.badge}
                    </div>
                    <div className="discover-offer-content">
                      <h3 className="discover-offer-title">{offer.title}</h3>
                      <p className="discover-offer-subtitle">{offer.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* New on Quick Plate */}
            <motion.section 
              className="discover-section"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            >
              <div className="discover-section-header">
                <h2 className="discover-section-title">{activeCategory}</h2>
                <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>arrow_forward</span>
              </div>
              <div className="discover-new-list">
                {isLoading ? (
  [...Array(3)].map((_, idx) => (
    <div key={idx} className="discover-new-card skeleton-card">
      <div className="discover-new-img-wrap skeleton-img-wrap"></div>
      <div className="discover-new-info-row">
        <div style={{ flex: 1 }}>
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-subtitle"></div>
        </div>
      </div>
    </div>
  ))
) : displayList.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="discover-new-card" 
                    onClick={() => {
                      lightTap();
                      handleNavigateToRestaurant(item);
                    }}
                  >
                    <div className="discover-new-img-wrap">
                      <div 
                        className="discover-new-img" 
                        style={{ backgroundImage: `url('${item.img}')` }}
                      ></div>
                      <div className="discover-new-badge">New</div>
                      <div className="discover-new-gradient"></div>
                      <div className="discover-new-meta">
                        <div className="discover-new-pill">
                          <span className="material-symbols-outlined" style={{ color: '#facc15', fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span>{item.rating || "4.8"}</span>
                        </div>
                        <div className="discover-new-pill">
                          <span className="material-symbols-outlined">schedule</span>
                          <span>{item.time || "15-20 min"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="discover-new-info-row">
                      <div>
                        <h4 className="discover-new-title">{item.name}</h4>
                        <p className="discover-new-cuisine">{item.cuisine}</p>
                      </div>
                      <button className="discover-new-fav" onClick={(e) => { e.stopPropagation(); lightTap(); }}>
                        <span className="material-symbols-outlined">favorite</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </>
        ) : (
          <motion.section 
            className="discover-section"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="discover-section-header">
              <h2 className="discover-section-title">Search Results</h2>
            </div>
            <div className="discover-new-list">
              {displayList.map((item, idx) => (
                <div 
                  key={idx} 
                  className="discover-new-card" 
                  onClick={() => {
                    lightTap();
                    handleNavigateToRestaurant(item);
                  }}
                >
                  <div className="discover-new-img-wrap">
                    <div 
                      className="discover-new-img" 
                      style={{ backgroundImage: `url('${item.img}')` }}
                    ></div>
                    <div className="discover-new-gradient"></div>
                    <div className="discover-new-meta">
                      <div className="discover-new-pill">
                        <span className="material-symbols-outlined" style={{ color: '#facc15', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span>{item.rating || "4.8"}</span>
                      </div>
                      <div className="discover-new-pill">
                        <span className="material-symbols-outlined">schedule</span>
                        <span>{item.time || "15-20 min"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="discover-new-info-row">
                    <div>
                      <h4 className="discover-new-title">{item.name}</h4>
                      <p className="discover-new-cuisine">{item.cuisine}</p>
                    </div>
                    <button className="discover-new-fav" onClick={(e) => { e.stopPropagation(); lightTap(); }}>
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                </div>
              ))}
              {displayList.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No restaurants found matching "{searchQuery}"
                </div>
              )}
            </div>
          </motion.section>
        )}
      </main>

      {/* ─── Bottom Navigation ─── */}
      <nav className="home-bottom-nav">
        <div className="home-bottom-nav-inner">
          <Link to="/home" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">home</span>
            <span className="home-nav-label">Home</span>
          </Link>
          <Link to="/discover" className="home-nav-item active" onClick={lightTap}>
            <span className="material-symbols-outlined">explore</span>
            <span className="home-nav-label">Discover</span>
          </Link>
          <Link to="/orders" className="home-nav-item" onClick={lightTap}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="home-nav-badge" />
            </div>
            <span className="home-nav-label">Orders</span>
          </Link>
          <Link to="/profile" className="home-nav-item" onClick={lightTap}>
            <span className="material-symbols-outlined">person</span>
            <span className="home-nav-label">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Discover;
