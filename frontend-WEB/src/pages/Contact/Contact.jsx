import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Contact.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const Contact = () => {
  return (
    <>
      {/* Header */}
      <header className="landing-header">
        <motion.nav
          className="landing-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="landing-logo">QP</div>

          <div className="landing-nav-links">
            <Link to="/" className="landing-nav-link">
              Home
            </Link>

            <Link to="/features" className="landing-nav-link">
              Features
            </Link>

            <Link to="/contact" className="landing-nav-link active">
              Contact
            </Link>
          </div>
        </motion.nav>
      </header>

      {/* Main */}
      <main className="landing-main">
        {/* Background Blobs */}
        <div className="landing-blob-1"></div>
        <div className="landing-blob-2"></div>

        {/* Hero */}
        <motion.section
          className="contact-hero"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <span className="contact-badge">
            <span className="material-symbols-outlined">forum</span>
            CONTACT US
          </span>

          <h1 className="contact-title">
            We'd Love to <span>Hear From You</span>
          </h1>

          <p className="contact-subtitle">
            Questions, suggestions or feedback?
            <br />
            Our team is always ready to help.
          </p>
        </motion.section>

        {/* Contact Cards Grid */}
        <motion.section
          className="contact-grid"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <div className="contact-card">
            <div className="contact-icon orange">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <h3>Email</h3>
            <p>contact@quickplate.com</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon blue">
              <span className="material-symbols-outlined">call</span>
            </div>
            <h3>Phone</h3>
            <p>Coming Soon</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon green">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <h3>Location</h3>
            <p>Coimbatore, Tamil Nadu</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon purple">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <h3>Working Hours</h3>
            <p>Mon – Sun</p>
            <p>9:00 AM – 10:00 PM</p>
          </div>
        </motion.section>

        {/* Form */}
        <motion.div
          className="contact-form-card"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2>Send us a Message</h2>

          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent successfully!");
            }}
          >
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                placeholder="Subject"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows="6"
                placeholder="Type your message..."
                required
              />
            </div>

            <motion.button
              className="contact-btn"
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="material-symbols-outlined">send</span>
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="contact-footer"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="contact-footer-logo">QP</div>

          <h3>Quick Plate</h3>

          <p>
            Fresh food. Fast delivery.
            <br />
            Crafted with ❤️ for food lovers.
          </p>

          <div className="contact-footer-links">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <small>© 2026 Quick Plate. All Rights Reserved.</small>
        </motion.div>
      </main>

      {/* Bottom Fade */}
      <div className="landing-bottom-fade"></div>
    </>
  );
};

export default Contact;