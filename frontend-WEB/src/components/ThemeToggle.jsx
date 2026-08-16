import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../store/useAppStore';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'var(--color-gray-100)',
        color: 'var(--color-secondary)',
        border: '1px solid var(--color-gray-800)',
        cursor: 'pointer',
      }}
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
