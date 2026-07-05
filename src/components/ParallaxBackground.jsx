import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { gameState } from '../gameLogic';

const ParallaxImage = ({ initialX, z, width, height, texture, speedMultiplier }) => {
  const ref = useRef();
  
  useFrame((state, delta) => {
    if (ref.current && gameState.gameStarted) {
      // Move left based on global speed, scaled by depth
      ref.current.position.x -= (gameState.baseScrollSpeed * gameState.speed * speedMultiplier) * delta;
      
      // Loop seamlessly over a tighter area to prevent gaps
      if (ref.current.position.x < -30) {
        ref.current.position.x += 120; 
      }
    }
  });

  return (
    <mesh ref={ref} position={[initialX, (height / 2) - 5.5, z]} receiveShadow>
      <planeGeometry args={[width, height]} />
      {/* transparent={true} ensures the .png alpha channels render perfectly without ghosting */}
      <meshStandardMaterial map={texture} transparent={true} roughness={0.8} />
    </mesh>
  );
};

const texturePaths = [
  '/environment/1.png', '/environment/2.png', '/environment/3.png', 
  '/environment/4.png', '/environment/5.png', '/environment/6.png', 
  '/environment/7.png', '/environment/8.png', '/environment/9.png'
];

export const ParallaxBackground = () => {
  const textures = useTexture(texturePaths);

  const images = useMemo(() => {
    const items = [];
    
    // Generated 50 scattered background image items (increased from 30) to fill gaps
    for (let i = 0; i < 50; i++) {
      // Tighter packed X range (-30 to 90)
      const initialX = -30 + (Math.random() * 120);
      const z = -4 - (Math.random() * 12); // Depths from -4 to -16
      
      const depthFactor = (16 + z) / 12; 
      const speedMultiplier = 0.2 + (depthFactor * 0.6); 
      
      // Pick a random texture from the array
      const texture = textures[Math.floor(Math.random() * textures.length)];
      
      // Calculate the image's native aspect ratio so it doesn't squish or stretch!
      const aspectRatio = texture.image.width / texture.image.height;
      
      // Random scale for the height of the image (scaled up significantly for larger background elements)
      const height = 7 + (Math.random() * 8);
      // Derive the width strictly from the aspect ratio
      const width = height * aspectRatio;
      
      items.push({ id: i, initialX, z, width, height, texture, speedMultiplier });
    }
    return items;
  }, [textures]);

  return (
    <group>
      {images.map(img => (
        <ParallaxImage key={img.id} {...img} />
      ))}
    </group>
  );
};

useTexture.preload(texturePaths);
