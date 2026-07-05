import React, { useState, useEffect } from 'react';
import { gameState } from '../gameLogic';

export const GameOverScreen = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.gameOver !== isGameOver) {
        setIsGameOver(gameState.gameOver);
        setFinalScore(gameState.score);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isGameOver]);

  if (!isGameOver) return null;

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
      <img src="/laban_logo.png" alt="Laban Studio" style={{ width: '180px', marginBottom: '50px' }} />
      
      {/* GAME OVER Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          color: '#FFFFFF', fontSize: '95px', margin: '0', 
          lineHeight: '0.95', letterSpacing: '3px', textTransform: 'uppercase',
          textShadow: '0px 6px 0px rgba(0,0,0,0.1)'
        }}>
          GAME
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '25px', height: '8px', backgroundColor: '#7DD3FC', borderRadius: '10px', transform: 'rotate(-25deg)' }} />
          <h1 style={{ 
            color: '#7DD3FC', fontSize: '95px', margin: '0', 
            lineHeight: '0.95', letterSpacing: '3px', textTransform: 'uppercase',
            textShadow: '0px 6px 0px rgba(0,0,0,0.1)'
          }}>
            OVER!
          </h1>
          <div style={{ width: '25px', height: '8px', backgroundColor: '#7DD3FC', borderRadius: '10px', transform: 'rotate(25deg)' }} />
        </div>
      </div>
      
      {/* Score Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
        <div style={{ width: '80px', height: '3px', backgroundColor: '#38BDF8', borderRadius: '5px' }} />
        <span style={{ color: '#38BDF8', fontSize: '24px', letterSpacing: '4px', fontWeight: '900' }}>SCORE</span>
        <div style={{ width: '80px', height: '3px', backgroundColor: '#38BDF8', borderRadius: '5px' }} />
      </div>
      <h2 style={{ 
        color: '#FFFFFF', fontSize: '80px', margin: '0 0 60px 0', 
        letterSpacing: '4px', textShadow: '0px 5px 0px rgba(0,0,0,0.1)' 
      }}>
        {finalScore.toLocaleString()}
      </h2>
      
      {/* Try Again Button */}
      <button 
        onClick={() => window.location.reload()}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #BAE6FD'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
        style={{
          display: 'flex', alignItems: 'center', gap: '15px',
          padding: '18px 50px', fontSize: '32px', fontFamily: '"Nunito", sans-serif', fontWeight: '900',
          color: '#0284C7', backgroundColor: '#FFFFFF', 
          border: 'none', borderRadius: '50px', letterSpacing: '1px',
          cursor: 'pointer', boxShadow: '0px 6px 0px #BAE6FD', 
          textTransform: 'uppercase', transition: 'all 0.1s ease-in-out'
        }}
      >
        {/* Refresh Icon SVG */}
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0284C7' }}>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        TRY AGAIN
      </button>
    </div>
  );
};
