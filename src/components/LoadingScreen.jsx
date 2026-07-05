import React, { useEffect } from 'react';
import { useProgress } from '@react-three/drei';

export const LoadingScreen = ({ setAssetsLoaded }) => {
  const { progress } = useProgress();

  useEffect(() => {
    // When progress hits exactly 100%, we wait a brief moment for shaders to compile
    if (progress === 100) {
      const timer = setTimeout(() => {
        setAssetsLoaded(true);
      }, 1200); // 1.2s delay ensures absolute smoothness
      return () => clearTimeout(timer);
    }
  }, [progress, setAssetsLoaded]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#0EA5E9', zIndex: 999, // Covers everything
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      fontFamily: '"Nunito", sans-serif'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 5px solid #7DD3FC;
            border-top: 5px solid #FFFFFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
          }
        `}
      </style>

      {/* Studio Logo */}
      <img src="/laban_logo.png" alt="Laban Studio" style={{ width: '220px', marginBottom: '40px' }} />
      
      {/* Animated Spinner */}
      <div className="spinner"></div>
    </div>
  );
};
