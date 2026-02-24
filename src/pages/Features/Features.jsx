import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useHaptic from '../../hooks/useHaptic';
import './Features.css';

// Icons
import { 
  FiShield, FiCreditCard, FiTruck, FiActivity, 
  FiClock, FiLayers, FiSearch, FiKey, 
  FiTerminal, FiFileText, FiAlertTriangle, FiServer 
} from 'react-icons/fi';

import techBg from '../../assets/images/tech-bg.png';

const FEATURES_DATA = [
  {
    id: 1,
    title: 'Enterprise-Grade Refund Governance',
    subtitle: 'Multi-layer approval & audit trails',
    desc: 'Refunds aren’t just processed — they are governed. Our multi-stage refund workflow ensures fairness, transparency, and financial accountability.',
    icon: <FiShield />,
  },
  {
    id: 2,
    title: 'Stripe-Secured, Server-Verified Payments',
    subtitle: 'Webhook-based confirmation',
    desc: 'Payments are verified server-side using Stripe webhooks, ensuring no false confirmations and maximum financial integrity without storing card data.',
    icon: <FiCreditCard />,
  },
  {
    id: 3,
    title: 'Intelligent Delivery Assignment Engine',
    subtitle: 'Load balancing & zone assignment',
    desc: 'Smart dispatch engine automatically assigns the optimal delivery partner based on availability, workload, and service zones. True enterprise logistics logic.',
    icon: <FiTruck />,
  },
  {
    id: 4,
    title: 'Real-Time Order State Machine',
    subtitle: 'Strict state transition control',
    desc: 'Every order moves through a controlled state engine, ensuring real-time visibility and zero ambiguous status changes (CREATED → PAID → ASSIGNED → PICKED_UP).',
    icon: <FiActivity />,
  },
  {
    id: 5,
    title: 'Wallet Credit System with Expiry',
    subtitle: 'Partial redemption & lifecycle tracking',
    desc: 'Refunds can be converted into smart wallet credits with expiry tracking and partial redemption support natively built into the financial core.',
    icon: <FiClock />,
  },
  {
    id: 6,
    title: 'Queue-Based Operational Routing',
    subtitle: 'Role-based operational resolution',
    desc: 'Operational tickets are intelligently routed through service and finance queues for structured resolution, protecting team bandwidth.',
    icon: <FiLayers />,
  },
  {
    id: 7,
    title: 'Transparent Refund Timeline',
    subtitle: 'Real-time customer visibility',
    desc: 'Customers can track refund status in real time with transparent approval visibility, building trust through process clarity.',
    icon: <FiSearch />,
  },
  {
    id: 8,
    title: 'Role-Based Backend Governance',
    subtitle: 'Strict separation of duties',
    desc: 'Strict separation of duties ensures customers, service agents, and finance teams operate within controlled permission boundaries.',
    icon: <FiKey />,
  },
  {
    id: 9,
    title: 'API-First Architecture',
    subtitle: 'Built for scale and microservices',
    desc: 'Built with an API-first architecture, enabling scalability, mobile expansion, and microservice integration. The React frontend is purely API-driven.',
    icon: <FiTerminal />,
  },
  {
    id: 10,
    title: 'Full Financial Audit Trail',
    subtitle: 'Timestamped & role-tracked',
    desc: 'Every financial event is logged with a complete audit trail, ensuring traceability and compliance down to the original transaction.',
    icon: <FiFileText />,
  },
  {
    id: 11,
    title: 'Automated SLA & Escalation',
    subtitle: 'Operational monitoring capability',
    desc: 'Designed to support SLA-based escalation and automated operational monitoring, ensuring no order is left behind during peak spikes.',
    icon: <FiAlertTriangle />,
  },
  {
    id: 12,
    title: 'Production-Ready Backend',
    subtitle: 'Bulk-safe logic & robust validation',
    desc: 'Unlike typical demo applications, this system is built with production-grade validation rules, bulk-safe logic, and governor-limit awareness.',
    icon: <FiServer />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Features = () => {
  const { lightTap } = useHaptic();

  return (
    <div className="features-page">
      {/* ─── Glassmorphic Header ─── */}
      <header className="landing-header">
        <nav className="landing-nav" style={{ background: 'rgba(253, 252, 251, 0.85)' }}>
          <div className="landing-logo">QP</div>
          <div className="landing-nav-links">
            <Link to="/" className="landing-nav-link" onClick={lightTap}>Home</Link>
            <Link to="/features" className="landing-nav-link active" onClick={lightTap}>Features</Link>
            <Link to="/" className="landing-nav-link" onClick={lightTap}>Contact</Link>
          </div>
        </nav>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="features-hero">
        <div className="features-hero-bg">
          <img src={techBg} alt="Tech abstract background" />
        </div>
        <div className="features-hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="features-badge"
          >
            <FiServer /> Enterprise Backend
          </motion.div>
          <motion.h1
            className="features-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Production Grade. <br />
            <span>Built for Scale.</span>
          </motion.h1>
          <motion.p
            className="features-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore the 12 robust architectural capabilities that make Quick Plate a true enterprise-ready food delivery platform, far beyond a typical demo.
          </motion.p>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="features-grid-container">
        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {FEATURES_DATA.map((feature, index) => (
            <motion.div key={feature.id} className="feature-card" variants={itemVariants}>
              <div className="feature-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <div className="feature-content">
                <h4>{feature.subtitle}</h4>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Features;
