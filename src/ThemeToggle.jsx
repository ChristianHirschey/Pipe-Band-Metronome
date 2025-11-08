import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggle }) => {
  return (
    <div className="theme-toggle">
      <button aria-label="Toggle theme" className="theme-btn" onClick={toggle}>
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
};

export default ThemeToggle;
