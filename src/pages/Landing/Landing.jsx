import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import useHaptic from '../../hooks/useHaptic';
import './Landing.css';

/* ─── Image URLs ─── */
const FOOD_IMAGES = {
  sushi: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWjOsQeL-Lt-MLg7FIHEb3LxNyDoMCncgEqLO_gG0LfbmAY26ooPJSLALwzg46GDNod1VJzbiIP4eVs5M_0WaNyvAhp2jgKXjqz9GdL65JPM4XLVz5PXMg34pGxIqsGEVlIXUhJtPxlI3ZL5IzQIsRwmFmAEpsrpyTD-EXXku9yHtGMeAyKvGa1si9x8ixAbVNLGjYWZDi3GpRg22aM6awefmjCBfDMgzCQlF-IDZRS6dMo249sY1Gf1VlPLim1c0Wtuol-hvncevY',
  burger: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIVLq7cg2DsY4Dw1Dv-N3mH1ev7hGiwMSEtAkMb41GEGZ3NWK7evAuqaBMyAPxKkiWfWKvgy0nDn19gJTl36RHd5hphjpBZEHwnD5zk20Xz3OOqpcEORX-TSKWVxR8Sq03vPIHUrMBpMSwfx8YauQJCYaM9mvF_O0B0wiiuU6A1tz_aSdynsxPxodhs5brxxdbojLh_t-ic0gUZNfT-lRUTmhxPYdl_r1BhB55YUDUtCc1hXK1RrtsjFHPykKJvwn2ChzHDcNNp9Px',
  pasta: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3RUSyeNfRUjoKSIJUg-jCYTKHGQAyV3i_bp6BU03ww9Omna7o7kruG8QKCNULH6llAyVhqgOcwCn84YowMVJYJVyNjcDtmuwmvJxB-YFNujs8hvKnv2ekouIENgkkOj3RQ2vSP3CbQqqHM1AS54ApGkFN6U97FcUN6wsQOc9L38VkpT5oFqLqgw9GKcx1WcYiuzLvjPoFzXZmySUf4BZrklB5EaJl-nH5-ojW8u0FEWXhUPbp8jVZkULLtYeyezP2pA2hoVl5fqKM',
  dessert: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOhl1yjOKt_cFiqW9w_vcZMp1dEUEqSkIF_1PZ2iIkZrAMPdZWmq5nS0UsAxyiyLEANe-rPR00vzNRPE7gtW5F_ZxagryLxi0ew6lKQX3HlNyzqu5iDJHCJ5K-lyvjvro7takNhJHZXCemHKBQWECAbNr0M7UqsYN56Y7IwMX3szaterAKcLL9gjnTAhk1Z5X2ZjsrOEQUEbt_qilhyYQDuwE2oaBRpNEGotfphSL4XSiYM5zKYG8L2ce2Prupm8XZIwamR4fa9m0p',
};

const ACCENT_IMAGES = {
  leafTL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt5ceJrzyFqTV9Mhq7Bx86hdZUHGmG9AL3ORFh3J0O1f9WbyWqEUPSzcgkA-IrDCqLiDbJadL82mITGQgkq1zPvETLLZ139RqzDNmVqKrBAbLW1NFl9wN_i-faHzlfgg6v9MXuqZLgZyN__832kZUQ7zagPcI9_Q7VP0MnUVDAhcWDs86m66BLT73054hyUup61RiNaqCiMOV60DNGnztkbY4T2kU-xCuHorlZlpyQprkFS7bl9cYyLlDDiEGXpNnBcRelQoVtBb5U',
  chiliBR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADAv1ZcgYSZ0JFC7Ced5T3-tmlJTz8pIRcZvmAHo4AVq-TSq857N0HVZUamvoiH6RKDiZ5hg7dFC8Tvwrv8LgBXAotvf7YAKmX9-TTNkDco5w66y_6Qy_PKGlmwcS2T0mWRlDhDtsQ5yYsBaw88fgfEb6N-PGqFgBDmyIbmrZXq7MxhTkLuW3EZqum4LijvRxgeEJqIErFhdtiA6QTlmroblxskQspIs0l3SlcDuEUHINd7ADLH60cjVpabrykB3Ot4yjKVS8htlkM',
  leafR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX2FgPLWoTJXKv5jCoyUyf2a8_t4mWONgp4sv3iG8jVvBt5F_DAN9ADQlaQJEkadw9NCNCp1G-mVi7xAx-E7S6sbIlQjbW2JyHsGDaDcfRCdGffhYc4RfQs7XsUj4FBv3YBZ8kp-YBvWF6jcO_eEU2WEcqpyzK97L3nEv7o_M2ksp6BFwDU5Wvge4c7R1ukLhiT_7oMz7fB3nW_Z7RIy6KYXcUYmaC693uUnMo-aNCES5JmjIdt5091TnJPIw5KLwnpEl9b1IsryTT',
};

const USER_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxnLZB4L4bLxchHeLZCCq3Lvq6vr4bzfPUp8VTZQ1gAfTTrCvF9aS3hIvFSSIw1ic8QXQ2xlKR4XrB3_rDYjHaPQvjTucWE22lkmXd2OIWXGGXANk5z4j6JKEmQRuP0sZcYHjAafhHfbgJqaB2Lcf-zQ4llzoKpkxiGMr_37Edrqf2chGZ-yfZXcy-5sUl1L_VLZA549jFBmkyUmR80Jr8fsLJRAMBLMq1fBZh9ADsDTa-fAYcZH-HEnjfUnfBHuWcxT6QaCUniXf',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD8TCvCbzx2x0oaDvSqjJbTbLVEM-KV0wUEQoaZBkGuc0RX8AEFR6cYjjobwSbGOr91pab32bQlpxJgvehfId_A-52QTXU-JCMUDnB6hR4gTC1xNrvKspp57uUVLa5Ak4RJXvpyyAoJGYxOlcPhpPtRF5AXL7FoPjWxCMWcyWaZP9PWL4YJWO46uCY11qDPTOqWLgvROtJrGNAbBfPmltS52ku47V3YY0E3WXC5SeFkTDK9ULfOoXMIxrJt7GIKmhC_mX72jxzTRwxB',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBfbvxpSTRSjtGCtbMQW8vh3mkTFgo31IxPyM2-3k-vPt6VKx0KxrNt72vj2UmYPdiF6YMLzLJvu2uUm21gN_3YUjX2bWYI0vkX7DLrkEn4B4qzSsU-Tkj1MaPebM871de8UrzWSovxb542bFDvGf2bQSorrZxyxEdYb5nh7k1pTKhj2GoyEe7RmjuReR9gXW5kM1xm6HHJZGhOFJvXL4f7vh_CLWvyb1iMizbKnlw-3gzVw-ddWUiz6ksxYayJvyDHmgGENRdhXWuQ',
];

/* ─── Animation Variants ─── */
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};

const floatAnimation = {
  animate: {
    y: [-6, 6, -6],
    rotate: [-2, 2, -2],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const Landing = () => {
  const { lightTap, mediumTap } = useHaptic();
  const heroRef = useRef(null);
  const featureRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: '-50px' });
  const isFeatureInView = useInView(featureRef, { once: true, margin: '-50px' });

  const handleGetStarted = () => {
    mediumTap();
    // Will navigate to home/onboarding when ready
  };

  const handleDownload = () => {
    lightTap();
    // Will trigger app download
  };

  return (
    <>
      {/* ─── Glassmorphic Header ─── */}
      <header className="landing-header">
        <motion.nav
          className="landing-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="landing-logo">QP</div>
          <div className="landing-nav-links">
            <a href="#" className="landing-nav-link active" onClick={lightTap}>
              Home
            </a>
            <a href="#" className="landing-nav-link" onClick={lightTap}>
              Features
            </a>
            <a href="#" className="landing-nav-link" onClick={lightTap}>
              Contact
            </a>
          </div>
        </motion.nav>
      </header>

      {/* ─── Main Content ─── */}
      <main className="landing-main">
        {/* Background Blobs */}
        <div className="landing-blob-1" />
        <div className="landing-blob-2" />

        {/* Hero Section */}
        <div className="landing-hero" ref={heroRef}>
          {/* Title */}
          <motion.h1
            className="landing-title"
            variants={fadeInUp}
            initial="hidden"
            animate={isHeroInView ? 'visible' : 'hidden'}
            custom={0}
          >
            QUICK <span className="landing-title-accent">PLATE</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="landing-subtitle"
            variants={fadeInUp}
            initial="hidden"
            animate={isHeroInView ? 'visible' : 'hidden'}
            custom={0.15}
          >
            Freshly Prepared.
            <br />
            <span className="landing-subtitle-dim">Rapidly Delivered.</span>
          </motion.p>

          {/* Circular Food Image Grid */}
          <motion.div
            className="landing-circle-wrapper"
            variants={scaleIn}
            initial="hidden"
            animate={isHeroInView ? 'visible' : 'hidden'}
            custom={0.3}
          >
            {/* Leaf accent top-left */}
            <motion.div
              className="landing-accent landing-accent-leaf-tl"
              {...floatAnimation}
            >
              <img src={ACCENT_IMAGES.leafTL} alt="Mint leaf" />
            </motion.div>

            {/* Circle grid */}
            <div className="landing-circle">
              <div className="landing-circle-img-wrap">
                <img src={FOOD_IMAGES.sushi} alt="Premium Sushi" loading="eager" />
              </div>
              <div className="landing-circle-img-wrap">
                <img src={FOOD_IMAGES.burger} alt="Gourmet Burger" loading="eager" />
              </div>
              <div className="landing-circle-img-wrap">
                <img src={FOOD_IMAGES.pasta} alt="Handmade Pasta" loading="eager" />
              </div>
              <div className="landing-circle-img-wrap">
                <img src={FOOD_IMAGES.dessert} alt="Vibrant Dessert" loading="eager" />
              </div>

              {/* Cross divider lines */}
              <div className="landing-circle-cross">
                <div className="landing-circle-cross-h" />
                <div className="landing-circle-cross-v" />
              </div>
            </div>

            {/* Chili accent bottom-right */}
            <motion.div
              className="landing-accent landing-accent-chili-br"
              animate={{
                y: [-4, 4, -4],
                rotate: [-14, -10, -14],
                transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <img src={ACCENT_IMAGES.chiliBR} alt="Chili slice" />
            </motion.div>

            {/* Leaf accent right */}
            <motion.div
              className="landing-accent landing-accent-leaf-r"
              animate={{
                y: [-3, 5, -3],
                rotate: [178, 182, 178],
                transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <img src={ACCENT_IMAGES.leafR} alt="Mint leaf" />
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="landing-cta-group"
            variants={fadeInUp}
            initial="hidden"
            animate={isHeroInView ? 'visible' : 'hidden'}
            custom={0.5}
          >
            <motion.button
              className="landing-btn-primary"
              onClick={handleGetStarted}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              Get Started
            </motion.button>
            <motion.button
              className="landing-btn-outline"
              onClick={handleDownload}
              whileTap={{ scale: 0.97 }}
            >
              Download App
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Card */}
        <motion.div
          className="landing-feature-card"
          ref={featureRef}
          variants={fadeInUp}
          initial="hidden"
          animate={isFeatureInView ? 'visible' : 'hidden'}
          custom={0}
        >
          <div className="landing-feature-inner">
            <div className="landing-feature-icon">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="landing-feature-text">
              <h3>30 Min Delivery</h3>
              <p>Your meal, hot and ready, within half an hour.</p>
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="landing-social-proof"
          variants={fadeInUp}
          initial="hidden"
          animate={isFeatureInView ? 'visible' : 'hidden'}
          custom={0.2}
        >
          <div className="landing-avatars">
            {USER_AVATARS.map((url, i) => (
              <div key={i} className="landing-avatar">
                <img src={url} alt={`User ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          <span className="landing-social-text">Trusted by 50k+ foodies</span>
        </motion.div>
      </main>

      {/* Bottom gradient fade */}
      <div className="landing-bottom-fade" />
    </>
  );
};

export default Landing;
