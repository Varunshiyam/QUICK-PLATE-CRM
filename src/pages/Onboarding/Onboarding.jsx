import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useHaptic from '../../hooks/useHaptic';
import useAppStore from '../../store/useAppStore';
import { signInWithGoogleAndSync } from '../../services/firebase';
import './Onboarding.css';

/* ─── Mock Food Images for Carousel ─── */
const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2600&auto=format&fit=crop', // Salad bowl
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2681&auto=format&fit=crop', // Pizza
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop', // Grilled meat
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2669&auto=format&fit=crop', // Gourmet crust
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: d, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Onboarding = () => {
  const { lightTap, mediumTap } = useHaptic();
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % FOOD_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    mediumTap();
    try {
      const dbUser = await signInWithGoogleAndSync();
      setUser({
        uid: dbUser.firebaseUid,
        customerId: dbUser.customerId,
        displayName: dbUser.name,
        email: dbUser.email,
        photoURL: dbUser.photoURL,
        method: 'google',
      });
      toast.success('Successfully logged in with Google!');
      navigate('/onboarding-details');
    } catch (err) {
      toast.error('Google verification failed. Please try again.');
    }
  };

  return (
    <div className="onboarding-page">
      {/* Background Decor */}
      <div className="onboard-bg-grid" />
      <div className="onboard-bg-curve">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#FB7E18" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,160C672,160,768,192,864,213.3C960,235,1056,245,1152,224C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="onboard-content">
        
        {/* Header Content */}
        <motion.div
          className="onboard-header-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <h1 className="onboard-title-elegant">
            Welcome to<br />Quick Plate
          </h1>
          <p className="onboard-desc-elegant">
            Your favorite meals, delivered fast.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="auth-selection"
            className="onboard-carousel-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dynamic Image Carousel */}
            <div className="carousel-track">
              {FOOD_IMAGES.map((imgUrl, index) => {
                let offset = index - activeSlide;
                // Handle wrap-around math to make infinite loop feel smoother
                if (offset < 0) offset += FOOD_IMAGES.length;
                if (offset > 2) offset -= FOOD_IMAGES.length;

                let scale = offset === 1 ? 1 : 0.85;
                let zIndex = offset === 1 ? 10 : 5;
                let translateX = (offset - 1) * 105; // Spread logic
                
                return (
                  <motion.div
                    key={index}
                    className="carousel-card"
                    animate={{
                      scale,
                      x: `${translateX}%`,
                      zIndex,
                      opacity: offset === 1 ? 1 : 0.5
                    }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <img src={imgUrl} alt={`Food ${index}`} />
                  </motion.div>
                );
              })}
            </div>

            {/* Dots */}
            <div className="carousel-dots">
              {FOOD_IMAGES.map((_, i) => (
                <div key={i} className={`carousel-dot ${i === activeSlide ? 'active' : ''}`} />
              ))}
            </div>

            {/* Action Buttons Block */}
            <div className="onboard-auth-block">
              <button className="onboard-google-btn" onClick={handleGoogleLogin}>
                <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google" />
                Sign In with Google
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
