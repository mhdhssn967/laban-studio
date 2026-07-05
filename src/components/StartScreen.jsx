import React, { useState, useEffect } from 'react';
import { gameState, sounds } from '../gameLogic';

const dummyLeaderboard = Array.from({ length: 25 }).map((_, i) => ({
  name: `Player ${Math.floor(Math.random() * 900) + 100}`,
  score: 15000 - i * 550
}));
dummyLeaderboard[0].name = "LabanMaster";
dummyLeaderboard[1].name = "SpeedRunner99";
dummyLeaderboard[2].name = "ArcadeKing";

export const StartScreen = () => {
  const [isStarted, setIsStarted] = useState(gameState.gameStarted);
  const [playerName, setPlayerName] = useState('');
  const [view, setView] = useState('main'); // 'main', 'register', 'leaderboard'
  
  // Registration form states
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');

  useEffect(() => {
    // Check cache
    const cached = localStorage.getItem('laban_playerName');
    if (cached) {
      setPlayerName(cached);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.gameStarted !== isStarted) {
        setIsStarted(gameState.gameStarted);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isStarted]);

  if (isStarted) return null;

  const triggerStart = () => {
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

  const handlePlayClicked = () => {
    if (playerName) {
      triggerStart();
    } else {
      setView('register');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    
    // Cache the name
    localStorage.setItem('laban_playerName', inputName.trim());
    setPlayerName(inputName.trim());
    triggerStart();
  };
  
  const buttonStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
    padding: '20px 70px', fontSize: '36px', fontFamily: '"Nunito", sans-serif', fontWeight: '900',
    color: '#0284C7', backgroundColor: '#FFFFFF', 
    border: 'none', borderRadius: '50px', letterSpacing: '2px',
    cursor: 'pointer', boxShadow: '0px 6px 0px #BAE6FD', 
    textTransform: 'uppercase', transition: 'all 0.1s ease-in-out',
    width: '100%', maxWidth: '350px'
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#0EA5E9', zIndex: 100, 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      fontFamily: '"Nunito", sans-serif', overflow: 'hidden'
    }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap');`}
      </style>
      
      {view === 'main' && (
        <>
          <img src="/laban_logo.png" alt="Laban Studio" style={{ width: '220px', marginBottom: '10px' }} />
          <img src="/char.png" alt="Character" style={{ width: '280px', marginBottom: '30px' }} />
          
          {playerName && (
            <div style={{ color: '#E0F2FE', fontSize: '24px', fontWeight: '900', marginBottom: '20px', letterSpacing: '1px' }}>
              WELCOME BACK, {playerName.toUpperCase()}!
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
            <button 
              onClick={handlePlayClicked}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #BAE6FD'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
              style={buttonStyle}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0284C7' }}>
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              PLAY
            </button>
            
            <button 
              onClick={() => setView('leaderboard')}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #BAE6FD'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #BAE6FD'; }}
              style={{ ...buttonStyle, backgroundColor: '#0284C7', color: '#FFFFFF', boxShadow: '0px 6px 0px #0369A1' }}
            >
              LEADERBOARD
            </button>
          </div>
        </>
      )}

      {view === 'register' && (
        <form onSubmit={handleRegisterSubmit} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          backgroundColor: '#0284C7', padding: '40px', borderRadius: '30px', 
          boxShadow: '0px 10px 30px rgba(0,0,0,0.2)', width: '90%', maxWidth: '400px'
        }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '32px', marginTop: 0, marginBottom: '30px', letterSpacing: '2px' }}>NEW PLAYER</h2>
          
          <input 
            type="text" 
            placeholder="ENTER YOUR NAME" 
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            required
            style={{
              width: '100%', padding: '15px 20px', borderRadius: '15px', border: 'none', 
              fontSize: '20px', fontFamily: '"Nunito", sans-serif', fontWeight: '900',
              marginBottom: '20px', outline: 'none', boxSizing: 'border-box', color: '#0369A1'
            }}
          />
          
          <input 
            type="tel" 
            placeholder="PHONE NUMBER" 
            value={inputPhone}
            onChange={(e) => setInputPhone(e.target.value)}
            required
            style={{
              width: '100%', padding: '15px 20px', borderRadius: '15px', border: 'none', 
              fontSize: '20px', fontFamily: '"Nunito", sans-serif', fontWeight: '900',
              marginBottom: '40px', outline: 'none', boxSizing: 'border-box', color: '#0369A1'
            }}
          />
          
          <button 
            type="submit"
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #075985'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #075985'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #075985'; }}
            style={{ ...buttonStyle, backgroundColor: '#38BDF8', color: '#FFFFFF', boxShadow: '0px 6px 0px #075985' }}
          >
            START
          </button>
          
          <div onClick={() => setView('main')} style={{ color: '#BAE6FD', marginTop: '20px', fontWeight: '700', cursor: 'pointer' }}>
            CANCEL
          </div>
        </form>
      )}

      {view === 'leaderboard' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          backgroundColor: '#0284C7', padding: '30px', borderRadius: '30px', 
          boxShadow: '0px 10px 30px rgba(0,0,0,0.2)', width: '90%', maxWidth: '500px', height: '80vh'
        }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '36px', marginTop: 0, marginBottom: '20px', letterSpacing: '2px' }}>TOP RUNNERS</h2>
          
          <div style={{ 
            width: '100%', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px',
            paddingRight: '10px'
          }}>
            {dummyLeaderboard.map((entry, idx) => {
              let bgColor = '#0369A1';
              let color = '#FFFFFF';
              if (idx === 0) { bgColor = '#FBBF24'; color = '#78350F'; } // Gold
              else if (idx === 1) { bgColor = '#94A3B8'; color = '#0F172A'; } // Silver
              else if (idx === 2) { bgColor = '#B45309'; color = '#FFFBEB'; } // Bronze
              
              return (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: bgColor, padding: '15px 20px', borderRadius: '15px',
                  color: color, fontWeight: '900', fontSize: '20px'
                }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <span style={{ opacity: 0.8 }}>#{idx + 1}</span>
                    <span>{entry.name}</span>
                  </div>
                  <span>{entry.score.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => setView('main')}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #075985'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #075985'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0px 6px 0px #075985'; }}
            style={{ ...buttonStyle, backgroundColor: '#38BDF8', color: '#FFFFFF', boxShadow: '0px 6px 0px #075985', marginTop: '20px', padding: '15px 50px', fontSize: '24px' }}
          >
            BACK
          </button>
        </div>
      )}
    </div>
  );
};
