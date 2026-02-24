import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import './Onboarding.css';

/* Background illustration URLs from mockup */
const BG_TOP = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZH03LnZFjClUcB8auLGFe4iXGTZKPwtoc_7earTpfFLFpyJCZs0HnZvrIO9lRdlin_owGopgjo-eMqf8FxKWEdpRN11FShwLWF9Z7l7FV4qhusFk-YM9Ks3x-rR0l5pwRW6qQw9GcaCIK3IqOd9Nz0uQQzjdk9sAMRsSGOCpGXdvHjngM0ys6JcRfgZOyFuc2oxVMdee-vgSsOXFYq0vfqrhchkpb3dIRU1wD8DmpC7q6DlUQgQqjy4q2ZHuM5uOaqz6FmsWuOjuR';
const BG_BOTTOM = 'https://lh3.googleusercontent.com/aida-public/AB6AXuABfYDnL5_zoCyX-QN5ZP7bYuUCNQL4SYtiKb06PsU9R6p4pfJVtYja3L37HRT7xobQqj3H0PMcBKsD2H0-sBuurWe27O553ZPlDzXi0NvwQo6L7lt3eKj7OeXFpfZ1ndvAWQp9W2sNmMdzTDj9k0NY5uLmrK7V3UqWaXKupYuxKMRreLNqs8gQ7kH0wUItqSrl5DRvI46qqXtJQKGvtX-q35cjsNZkOr9AJHCfRyVLwRpePfVP8bwDsvw214qtxAC_RXyob2uQqWVH';

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

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mediumTap();
    // TODO: persist user data to Zustand store / Salesforce
    navigate('/');
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
      {/* Background illustrations — increased opacity for visibility */}
      <div className="onboard-bg-top">
        <img src={BG_TOP} alt="Fresh salad bowl" />
      </div>
      <div className="onboard-bg-bottom">
        <img src={BG_BOTTOM} alt="Fresh ingredients" />
      </div>

      {/* Content */}
      <div className="onboard-content">
        {/* Header */}
        <motion.div
          className="onboard-header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="onboard-icon-wrap">
            <span className="material-symbols-outlined">restaurant</span>
          </div>
          <h1 className="onboard-title">
            Welcome to the<br />Premium Experience
          </h1>
          <p className="onboard-desc">
            Let's get your profile ready for seamless delivery.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="onboard-form"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
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
            custom={0.3}
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
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="onboard-bottom"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
        >
          <motion.button
            className="onboard-cta"
            onClick={handleSubmit}
            whileTap={{ scale: 0.98 }}
          >
            Start Exploring
            <span className="material-symbols-outlined">arrow_forward</span>
          </motion.button>

          <p className="onboard-footer">
            By continuing, you agree to our Terms of Service and Privacy Policy powered by Salesforce.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
