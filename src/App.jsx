import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { InfinitePlatform } from './components/Platform';
import { Player } from './components/Player';
import { Lighting } from './components/Lighting';
import { PostProcessingEffects } from './components/PostProcessing';
import { ParallaxBackground } from './components/ParallaxBackground';
import { GameOverScreen } from './components/GameOverScreen';
import { StartScreen } from './components/StartScreen';
import { gameState } from './gameLogic';

import { Suspense } from 'react';
import { LoadingScreen } from './components/LoadingScreen';

const ScoreBoard = () => {
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    // Poll the global score state rapidly to keep the React UI perfectly synced with the 3D physics engine
    const interval = setInterval(() => {
      if (gameState.score !== score) {
        setScore(gameState.score);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [score]);
  
  return (
    <div style={{
      position: 'absolute', top: 20, left: 30, zIndex: 10,
      display: 'flex', alignItems: 'center', gap: '10px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '28px', fontWeight: 'bold',
      color: '#FFFFFF',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    }}>
      {/* Custom CSS Coin Icon */}
      <div style={{
         width: '28px', height: '28px', borderRadius: '50%',
         background: 'radial-gradient(circle at 30% 30%, #FFDF00, #DAA520)',
         border: '2px solid #B8860B',
         boxShadow: '0px 2px 4px rgba(0,0,0,0.5), inset 0px 1px 2px rgba(255,255,255,0.8)',
         display: 'flex', justifyContent: 'center', alignItems: 'center',
         fontSize: '16px', fontWeight: '900', color: '#8B6508', textShadow: '1px 1px 0px #FFDF00'
      }}>
         $
      </div>
      {score}
    </div>
  );
};



export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#BAE6FD', position: 'relative', overflow: 'hidden' }}>
      {/* Blurred and faded background skybox layer */}
      <div style={{
        position: 'absolute', top: '-5%', left: '-5%', width: '110%', height: '110%',
        background: 'url(/environment/bg.png) center center / cover no-repeat',
        filter: 'blur(4px) opacity(0.5)', zIndex: 0
      }} />
      
      {/* Full Screen Loading Overlay */}
      {!assetsLoaded && <LoadingScreen setAssetsLoaded={setAssetsLoaded} />}
      
      {/* Foreground UI and Game Canvas (Hidden completely until loaded to prevent stuttering) */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
        zIndex: 1, opacity: assetsLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in' 
      }}>
        <StartScreen />
        <GameOverScreen />
        <ScoreBoard />
        
        <Canvas 
        shadows={{ type: THREE.PCFSoftShadowMap }} 
        gl={{ 
          antialias: false, // Disabled native AA because we use SMAA post-processing
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <OrthographicCamera makeDefault position={[0, 3, 12]} zoom={60} near={-50} far={1000} />
          
          {/* Real 3D volumetric fog pushed far back to give a consistent, very subtle fade to all layers */}
          <fog attach="fog" args={['#BAE6FD', 15, 120]} />
          
          <Lighting />
          
          {/* Adds 3D depth through slower moving background objects */}
          <ParallaxBackground />
          
          <InfinitePlatform />
          <Player />
          
          {/* Post Processing Effects (can be toggled off for mobile performance) */}
          <PostProcessingEffects enable={true} />
        </Suspense>
        
      </Canvas>
      </div>
    </div>
  );
}
