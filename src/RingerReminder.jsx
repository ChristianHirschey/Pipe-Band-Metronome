import React, { useState, useEffect } from 'react';
import './RingerReminder.css';

const RingerReminder = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check if user has already seen the reminder this session
    const hasSeenReminder = sessionStorage.getItem('hasSeenRingerReminder');
    
    if (isMobile && !hasSeenReminder) {
      // Show after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenRingerReminder', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="ringer-reminder-overlay" onClick={handleDismiss}>
      <div className="ringer-reminder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ringer-reminder-icon">🔔</div>
        <h3>Turn Your Ringer On</h3>
        <p>Make sure your device's ringer is on and volume is up to hear the metronome sounds.</p>
        <button className="btn" onClick={handleDismiss}>Got it!</button>
      </div>
    </div>
  );
};

export default RingerReminder;
