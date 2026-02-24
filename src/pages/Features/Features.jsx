import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiShield, FiCreditCard, FiTruck, FiActivity,
  FiClock, FiLayers, FiSearch, FiLock,
  FiTerminal, FiFileText, FiZap, FiServer
} from 'react-icons/fi';
import useHaptic from '../../hooks/useHaptic';
import techBg from '../../assets/images/tech-bg.png';
import './Features.css';

const FEATURES = [
  { icon: <FiShield />,     color: 'orange', title: 'Refund Governance',       desc: 'Multi-stage approval workflow with full audit trail.' },
  { icon: <FiCreditCard />, color: 'blue',   title: 'Stripe Payments',         desc: 'Server-verified via webhooks. Zero card data stored.' },
  { icon: <FiTruck />,      color: 'green',  title: 'Smart Delivery Engine',   desc: 'Zone-based assignment with load balancing.' },
  { icon: <FiActivity />,   color: 'purple', title: 'Order State Machine',     desc: 'Controlled transitions from Created → Delivered.' },
  { icon: <FiClock />,      color: 'pink',   title: 'Wallet Credits',          desc: 'Expiry tracking with partial redemption support.' },
  { icon: <FiLayers />,     color: 'cyan',   title: 'Queue Routing',           desc: 'Role-based ticket routing through service layers.' },
  { icon: <FiSearch />,     color: 'amber',  title: 'Refund Timeline',         desc: 'Real-time status visibility builds customer trust.' },
  { icon: <FiLock />,       color: 'lime',   title: 'Role-Based Access',       desc: 'Strict permission boundaries per team role.' },
  { icon: <FiTerminal />,   color: 'rose',   title: 'API-First Design',        desc: 'Scalable architecture ready for microservices.' },
  { icon: <FiFileText />,   color: 'sky',    title: 'Audit Trail',             desc: 'Every financial event timestamped & role-tracked.' },
  { icon: <FiZap />,        color: 'teal',   title: 'SLA & Escalation',        desc: 'Automated monitoring with escalation triggers.' },
  { icon: <FiServer />,     color: 'indigo', title: 'Production Backend',      desc: 'Governor-aware with bulk-safe validation logic.' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Features = () => {
  const { lightTap } = useHaptic();

  return (
    <div className="features-page">
      {/* Nav */}
      <header className="landing-header">
        <nav className="landing-nav" style={{ background: 'rgba(15, 23, 42, 0.75)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="landing-logo">QP</div>
          <div className="landing-nav-links">
            <Link to="/" className="landing-nav-link" onClick={lightTap}>Home</Link>
            <Link to="/features" className="landing-nav-link active" onClick={lightTap}>Features</Link>
            <Link to="/" className="landing-nav-link" onClick={lightTap}>Contact</Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="feat-hero">
        <div className="feat-hero-bg">
          <img src={techBg} alt="" />
        </div>
        <div className="feat-hero-content">
          <motion.div className="feat-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FiServer size={13} /> Enterprise Backend
          </motion.div>
          <motion.h1 className="feat-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Built for <span>Scale</span>
          </motion.h1>
          <motion.p className="feat-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            12 production-grade capabilities powering a real enterprise food delivery platform.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="feat-section">
        <div className="feat-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="feat-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
            >
              <div className={`feat-icon ${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="feat-bottom">
        <Link to="/" onClick={lightTap}>
          <motion.button
            className="feat-back-btn"
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Home
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Features;
