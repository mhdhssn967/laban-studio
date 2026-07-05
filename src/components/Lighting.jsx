import React from 'react';
import { Environment } from '@react-three/drei';

export const Lighting = () => {
  return (
    <>
      {/* 
        Provides high-quality, image-based PBR lighting and reflections.
        'city' acts as a clean, realistic studio HDRI that doesn't render a skybox
        in the background (background={false} is default).
      */}
      <Environment preset="city" />

      {/* Soft Ambient Light to raise the overall dark threshold */}
      <ambientLight intensity={0.5} color="#ffffff" />

      {/* Hemisphere Light adds sky/ground color gradients to soften shadows */}
      <hemisphereLight skyColor="#ffffff" groundColor="#444444" intensity={0.6} />

      {/* Key Light: Strong directional light simulating main sun/studio lamp with soft shadows */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005} // Prevents shadow acne artifacts
      />

      {/* Fill/Rim Light: Weaker light from opposite angle to highlight edges and fill dark spots */}
      <directionalLight 
        position={[-10, 5, -10]} 
        intensity={0.8} 
        color="#aaccff" 
      />
    </>
  );
};
