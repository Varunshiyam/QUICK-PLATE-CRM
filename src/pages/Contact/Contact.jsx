import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import useHaptic from '../../hooks/useHaptic';
import '../Home/Home.css';
import '../Landing/Landing.css';
import './Contact.css';

const Contact = () => {

  const navigate = useNavigate();
  const { lightTap, mediumTap } = useHaptic();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mediumTap();

    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSending(true);

    // Simulate send
    await new Promise(r => setTimeout(r, 1200));

    toast.success('Message sent! Our team will get back to you shortly.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (

    <div className="contact-container">

      {/* ─── Glassmorphic Header ─── */}
      <header className="landing-header">
        <motion.nav
          className="landing-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="landing-logo">QP</div>
          <div className="landing-nav-links">
            <Link to="/" className="landing-nav-link" onClick={lightTap}>
              Home
            </Link>
            <Link
              to="/features"
              className="landing-nav-link"
              onClick={lightTap}
            >
              Features
            </Link>
            <Link to="/contact" className="landing-nav-link active" onClick={lightTap}>
              Contact
            </Link>
          </div>
        </motion.nav>
      </header>

      {/* Main */}
      <main className="contact-main">

        {/* Hero */}
        <div className="contact-hero">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you — send us a message anytime</p>
        </div>

        {/* Contact Info Cards */}
        <section className="contact-section">
          <div className="contact-section-header">
            <h3 className="contact-section-title">Our Details</h3>
          </div>
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <span className="material-symbols-outlined contact-info-icon">mail</span>
              <span className="contact-info-label">Email</span>
              <a href="mailto:hello@quickplate.com" className="contact-info-value">hello@quickplate.com</a>
            </div>
            <div className="contact-info-card">
              <span className="material-symbols-outlined contact-info-icon">call</span>
              <span className="contact-info-label">Phone</span>
              <a href="tel:+18001234567" className="contact-info-value">+1 (800) 123-4567</a>
            </div>
            <div className="contact-info-card">
              <span className="material-symbols-outlined contact-info-icon">location_on</span>
              <span className="contact-info-label">Address</span>
              <span className="contact-info-value">123 Main Street, Suite 400<br />New York, NY 10001</span>
            </div>
            <div className="contact-info-card">
              <span className="material-symbols-outlined contact-info-icon">schedule</span>
              <span className="contact-info-label">Hours</span>
              <span className="contact-info-value">Mon–Fri: 9 AM – 11 PM<br />Sat–Sun: 10 AM – 10 PM</span>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-section">
          <div className="contact-section-header">
            <h3 className="contact-section-title">Send a Message</h3>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label className="contact-label" htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                className="contact-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="contact-input"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="contact-input"
                placeholder="How can we help?"
                value={form.subject}
                onChange={handleChange}
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                className="contact-textarea"
                placeholder="Tell us what's on your mind..."
                rows={5}
                value={form.message}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="contact-submit"
              disabled={sending}
            >
              {sending ? (
                <span>Sending<span className="contact-dots">...</span></span>
              ) : (
                <span>Send Message</span>
              )}
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </section>

        {/* Social Links */}
        <section className="contact-section">
          <div className="contact-section-header">
            <h3 className="contact-section-title">Follow Us</h3>
          </div>
          <div className="contact-social-row">
            <a href="#" className="contact-social-link" onClick={lightTap} aria-label="Instagram">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a href="#" className="contact-social-link" onClick={lightTap} aria-label="Twitter">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a href="#" className="contact-social-link" onClick={lightTap} aria-label="Facebook">
              <span className="material-symbols-outlined">facebook</span>
            </a>
            <a href="#" className="contact-social-link" onClick={lightTap} aria-label="LinkedIn">
              <span className="material-symbols-outlined">work</span>
            </a>
          </div>
        </section>

      </main>

      {/* Bottom Navigation */}
      <nav className="home-bottom-nav">
        <div className="home-bottom-nav-inner">
          <Link
            to="/home"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="home-nav-label">Home</span>
          </Link>
          <Link
            to="/discover"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">explore</span>
            <span className="home-nav-label">Discover</span>
          </Link>
          <Link
            to="/orders"
            className="home-nav-item"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="home-nav-label">Orders</span>
          </Link>
          <Link
            to="/profile"
            className="home-nav-item active"
            onClick={lightTap}
          >
            <span className="material-symbols-outlined">person</span>
            <span className="home-nav-label">Profile</span>
          </Link>
        </div>
      </nav>

    </div>

  );

};

export default Contact;
