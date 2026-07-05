import React, { useState, useEffect } from 'react';
import { gameState, sounds } from '../gameLogic';

export const StartScreen = () => {
  const [isStarted, setIsStarted] = useState(gameState.gameStarted);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.gameStarted !== isStarted) {
        setIsStarted(gameState.gameStarted);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isStarted]);

  if (isStarted) return null;

  const handleStart = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen().catch(() => {});
      }
    } catch (e) {
      console.log('Fullscreen request failed:', e);
    }
    
    gameState.gameStarted = true;
    sounds.bgm.play();
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#0EA5E9', zIndex: 100, 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      fontFamily: '"Nunito", sans-serif'
    }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');`}
      </style>
      
      {/* Studio Logo */}
      <img src="/laban_logo.png" alt="Laban Studio" style={{ width: '220px', marginBottom: '30px' }} />
      
      {/* Character Image */}
      <img src="/char.png" alt="Character" style={{ width: '280px', marginBottom: '60px' }} />
      
      {/* Start Game Button */}
      <button 
        onClick={handleStart}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #BAE6FD'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
        style={{
          display: 'flex', alignItems: 'center', gap: '15px',
          padding: '20px 70px', fontSize: '36px', fontFamily: '"Nunito", sans-serif', fontWeight: '900',
          color: '#0284C7', backgroundColor: '#FFFFFF', 
          border: 'none', borderRadius: '50px', letterSpacing: '2px',
          cursor: 'pointer', boxShadow: '0px 6px 0px #BAE6FD', 
          textTransform: 'uppercase', transition: 'all 0.1s ease-in-out'
        }}
      >
        {/* Play Icon SVG */}
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0284C7', marginLeft: '5px' }}>
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
        PLAY
      </button>
    </div>
  );
};
