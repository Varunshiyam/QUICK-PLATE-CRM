import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useHaptic from '../../hooks/useHaptic';
import '../Landing/Landing.css';
import './Contact.css';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const Contact = () => {
  const { lightTap, mediumTap } = useHaptic();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mediumTap();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const contactInfo = [
    {
      icon: 'mail',
      title: 'Email Us',
      lines: ['support@quickplate.com', 'hello@quickplate.com'],
    },
    {
      icon: 'call',
      title: 'Phone',
      lines: ['+1 (555) 123-4567'],
    },
    {
      icon: 'location_on',
      title: 'Office',
      lines: ['123 Flavor Street, Suite 200', 'San Francisco, CA 94105'],
    },
    {
      icon: 'schedule',
      title: 'Hours',
      lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Sat: 10:00 AM – 2:00 PM'],
    },
  ];

  const socialLinks = [
    { label: 'GitHub', icon: 'code', url: 'https://github.com/quickplate' },
    { label: 'LinkedIn', icon: 'work', url: 'https://linkedin.com/company/quickplate' },
    { label: 'Twitter', icon: 'alternate_email', url: 'https://twitter.com/quickplate' },
    { label: 'Instagram', icon: 'photo_camera', url: 'https://instagram.com/quickplate' },
  ];

  return (
    <div className="contact-container">
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="landing-logo">QP</div>
          <div className="landing-nav-links">
            <Link to="/" className="landing-nav-link" onClick={lightTap}>Home</Link>
            <Link to="/features" className="landing-nav-link" onClick={lightTap}>Features</Link>
            <Link to="/contact" className="landing-nav-link active" onClick={lightTap}>Contact</Link>
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <motion.div
          className="contact-content"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div className="contact-hero" variants={fadeUp}>
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Reach out using any of the channels below.</p>
          </motion.div>

          <motion.section className="contact-info-grid" variants={fadeUp}>
            {contactInfo.map((item) => (
              <div className="contact-info-card" key={item.title}>
                <div className="contact-info-icon">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="contact-info-title">{item.title}</h3>
                {item.lines.map((line, i) => (
                  <p className="contact-info-line" key={i}>{line}</p>
                ))}
              </div>
            ))}
          </motion.section>

          <motion.section className="contact-social-section" variants={fadeUp}>
            <h3 className="contact-section-title">Follow Us</h3>
            <div className="contact-social-links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                  onClick={lightTap}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </motion.section>

          <motion.section className="contact-form-section" variants={fadeUp}>
            <h3 className="contact-section-title">Send a Message</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name" className="contact-label">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="contact-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="email" className="contact-label">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="contact-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="subject" className="contact-label">Subject</label>
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
                <label htmlFor="message" className="contact-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  className="contact-textarea"
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="contact-submit-btn"
                disabled={sending}
              >
                {sending ? (
                  <span className="contact-sending">Sending<span className="contact-dots"><span>.</span><span>.</span><span>.</span></span></span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default Contact;
