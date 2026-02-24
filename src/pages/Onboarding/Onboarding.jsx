import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useHaptic from '../../hooks/useHaptic';
import useAppStore from '../../store/useAppStore';
import { signInWithGoogle } from '../../services/firebase';
import bgImage from '../../assets/images/Background.png';
import './Onboarding.css';

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
  
  const [authMode, setAuthMode] = useState('initial'); // 'initial' or 'form'

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    mediumTap();
    try {
      const user = await signInWithGoogle();
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        method: 'google',
      });
      toast.success('Successfully logged in with Google!');
      navigate('/home');
    } catch (err) {
      toast.error('Google verification failed. Please try again.');
    }
  };

  const handleSubmit = () => {
    mediumTap();
    if (!form.fullName || !form.email) {
      toast.error('Please enter your name and email.');
      return;
    }
    // Persist via Zustand
    setUser({
      displayName: form.fullName,
      email: form.email,
      phone: form.phone,
      method: 'form',
    });
    toast.success('Profile completed successfully!');
    navigate('/home');
  };

  const handleUseLocation = () => {
    lightTap();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('Location:', pos.coords.latitude, pos.coords.longitude);
        },
        (err) => console.warn('Geolocation error:', err)
      );
    }
  };

  return (
    <div className="onboarding-page">
      {/* Background image — partially visible */}
      <div className="onboard-bg">
        <img src={bgImage} alt="" />
      </div>

      {/* Content */}
      <div className="onboard-content">
        
        {/* Header - Always visible */}
        <motion.div
          className="onboard-header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          {authMode === 'form' && (
            <button className="onboard-back-btn" onClick={() => { lightTap(); setAuthMode('initial'); }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <div className="onboard-icon-wrap">
            <span className="material-symbols-outlined">restaurant</span>
          </div>
          <h1 className="onboard-title">
            Welcome to the<br />Premium Experience
          </h1>
          <p className="onboard-desc">
            {authMode === 'initial' ? 'Choose how you want to sign in.' : "Let's get your profile ready for seamless delivery."}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {authMode === 'initial' ? (
            /* ─── Auth Selection Screen ─── */
            <motion.div
              key="auth-selection"
              className="onboard-auth-options"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button className="onboard-google-btn" onClick={handleGoogleLogin}>
                <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google" />
                Continue with Google
              </button>
              
              <div className="onboard-divider">
                <span>or</span>
              </div>

              <button className="onboard-qp-btn" onClick={() => { mediumTap(); setAuthMode('form'); }}>
                <span className="material-symbols-outlined">stylus_note</span>
                Quick Plate Login
              </button>
              
              <p className="onboard-footer" style={{ marginTop: '2rem' }}>
                By continuing, you agree to our Terms of Service and Privacy Policy powered by Salesforce.
              </p>
            </motion.div>
          ) : (
            /* ─── Form Screen ─── */
            <motion.div
              key="auth-form"
              className="onboard-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Full Name */}
              <div className="onboard-field">
                <label className="onboard-label">Full Name</label>
                <div className="onboard-input-wrap">
                  <span className="material-symbols-outlined">person</span>
                  <input
                    className="onboard-input"
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="onboard-field">
                <label className="onboard-label">Phone Number</label>
                <div className="onboard-input-wrap">
                  <span className="material-symbols-outlined">phone_iphone</span>
                  <input
                    className="onboard-input"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="onboard-field">
                <label className="onboard-label">Email Address</label>
                <div className="onboard-input-wrap">
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    className="onboard-input"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <motion.div
                className="onboard-address-section"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.2}
              >
                <h2 className="onboard-address-title">Set Delivery Address</h2>

                <button className="onboard-location-btn" onClick={handleUseLocation}>
                  <div className="onboard-location-btn-left">
                    <span className="material-symbols-outlined">my_location</span>
                    <span>Use Current Location</span>
                  </div>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>

                <div className="onboard-address-search">
                  <span className="material-symbols-outlined">location_on</span>
                  <span>Or search for an address...</span>
                </div>
              </motion.div>

              {/* Bottom CTA */}
              <motion.div
                className="onboard-bottom"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
              >
                <motion.button
                  className="onboard-cta"
                  onClick={handleSubmit}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Exploring
                  <span className="material-symbols-outlined">arrow_forward</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
