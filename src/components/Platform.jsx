import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { gameState, sounds } from '../gameLogic';

const GroundPlatform = ({ initialX, initialCount, model, actualPlatformWidth }) => {
  const ref = useRef();
  const baseWidth = actualPlatformWidth;
  const id = useRef(Math.random());
  
  const [count, setCount] = useState(initialCount);
  
  const blockModels = useMemo(() => {
    return Array.from({ length: 6 }).map(() => {
      const c = model.clone();
      c.scale.set(0.2, 0.2, 0.2); 
      return c;
    });
  }, [model]);

  useFrame((state, delta) => {
    if (!gameState.gameStarted) return;
    if (ref.current) {
      ref.current.position.x -= (gameState.baseScrollSpeed * gameState.speed) * delta;
      
      const rightEdge = ref.current.position.x + (baseWidth * (count - 0.5));
      
      // When it goes completely offscreen left
      if (rightEdge < -15) {
        let maxRight = 40; 
        for (const p of gameState.activeGroundPlatforms) {
           if (p.right > maxRight) maxRight = p.right;
        }
        
        // The player can jump approx 9.6 units horizontally at base speed with a double jump.
        // Massive gaps to require double jumps (4.0 to 8.0 units)
        const gap = 4.0 + Math.random() * 4.0;
        
        const newLeft = maxRight + gap;
        ref.current.position.x = newLeft + (baseWidth / 2);
        
        // Next segment is 1 to 4 blocks long
        setCount(Math.floor(Math.random() * 4) + 1);
      }
      
      const left = ref.current.position.x - (baseWidth / 2);
      const right = ref.current.position.x + (baseWidth * (count - 0.5));
      
      const existingIdx = gameState.activeGroundPlatforms.findIndex(p => p.id === id.current);
      
      // surfaceY: -2.3 because that's the established floorY for the character's feet
      const platData = { id: id.current, left, right, surfaceY: -2.3 }; 
      
      if (existingIdx !== -1) {
        gameState.activeGroundPlatforms[existingIdx] = platData;
      } else {
        gameState.activeGroundPlatforms.push(platData);
      }
    }
  });

  useEffect(() => {
    return () => {
      gameState.activeGroundPlatforms = gameState.activeGroundPlatforms.filter(p => p.id !== id.current);
    };
  }, []);

  return (
    <group ref={ref} position={[initialX, -3.0, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[i * baseWidth, 0, 0]}>
          <primitive object={blockModels[i]} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
      ))}
    </group>
  );
};

const FloatingPlatform = ({ initialX, initialY, model, actualPlatformWidth }) => {
  const ref = useRef();
  const baseWidth = actualPlatformWidth * 0.4; // width factor based on scale ratio (0.08 / 0.2 = 0.4)
  const id = useRef(Math.random());
  
  // Randomly 1, 2, or 3 platforms long
  const [count, setCount] = useState(() => Math.floor(Math.random() * 3) + 1);
  
  // Pre-clone 3 models so we don't clone on every render
  const blockModels = useMemo(() => {
    return Array.from({ length: 3 }).map(() => {
      const c = model.clone();
      c.scale.set(0.08, 0.08, 0.08); // Smaller version of the main platform
      return c;
    });
  }, [model]);

  useFrame((state, delta) => {
    if (!gameState.gameStarted) return;
    if (ref.current) {
      ref.current.position.x -= (gameState.baseScrollSpeed * gameState.speed) * delta;
      
      // Wrap around screen when off left edge
      if (ref.current.position.x < -30) {
        ref.current.position.x += 80 + (Math.random() * 60); 
        // Platforms should only come in two different heights
        ref.current.position.y = Math.random() > 0.5 ? 0.5 : 2.5; 
        setCount(Math.floor(Math.random() * 3) + 1);
      }

      // Update collision hitboxes dynamically in the game loop
      const existingIdx = gameState.activeFloatingPlatforms.findIndex(p => p.id === id.current);
      
      // Since the origin of the FBX is at its center, local x=0 spans from -baseWidth/2 to +baseWidth/2.
      const left = ref.current.position.x - (baseWidth / 2);
      const right = ref.current.position.x + (baseWidth * (count - 0.5));
      
      const platData = { 
        id: id.current, 
        y: ref.current.position.y, 
        surfaceY: ref.current.position.y + 0.28,
        left: left,
        right: right 
      };
      
      if (existingIdx !== -1) {
        gameState.activeFloatingPlatforms[existingIdx] = platData;
      } else {
        gameState.activeFloatingPlatforms.push(platData);
      }
    }
  });

  // Cleanup hitbox state if platform is removed
  useEffect(() => {
    return () => {
      gameState.activeFloatingPlatforms = gameState.activeFloatingPlatforms.filter(p => p.id !== id.current);
    };
  }, []);

  return (
    <group ref={ref} position={[initialX, initialY, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[i * baseWidth, 0, 0]}>
          <primitive object={blockModels[i]} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
      ))}
    </group>
  );
};

const CoinSpawner = ({ initialX }) => {
  const ref = useRef();
  const { scene } = useGLTF('/Goldcoin.glb');
  
  // 5 to 15 coins appearing linearly
  const [count, setCount] = useState(() => Math.floor(Math.random() * 11) + 5); 
  
  // Random height levels matching the platforms:
  // Ground level ~ -1.5
  // Lower floating platform ~ 1.5
  // Higher floating platform ~ 3.5
  const [yLevel, setYLevel] = useState(() => {
    const levels = [-1.5, 1.5, 3.5];
    return levels[Math.floor(Math.random() * levels.length)];
  });

  const coinRefs = useRef([]);
  const clonedCoins = useMemo(() => {
     // Pre-clone maximum possible coins (15) for performance
     return Array.from({ length: 15 }).map(() => scene.clone());
  }, [scene]);

  useFrame((state, delta) => {
    if (!gameState.gameStarted) return;
    if (ref.current) {
      // Move left at the exact same speed as the platforms
      ref.current.position.x -= (gameState.baseScrollSpeed * gameState.speed) * delta;
      
      // Loop the coins
      if (ref.current.position.x < -30) {
        // Reduced the added distance to spawn coins much more frequently
        ref.current.position.x += 60 + (Math.random() * 40); 
        setCount(Math.floor(Math.random() * 11) + 5);
        const levels = [-1.5, 1.5, 3.5];
        setYLevel(levels[Math.floor(Math.random() * levels.length)]);
        
        // Respawn collected coins when they loop back around!
        for (let i = 0; i < 15; i++) {
          if (coinRefs.current[i]) {
            coinRefs.current[i].userData.collected = false;
            coinRefs.current[i].userData.burstTime = 0;
            coinRefs.current[i].visible = true;
            coinRefs.current[i].scale.setScalar(1); // Reset the parent group scale to 1 (not 0.24!)
          }
        }
      }
    }
    
    // Animation: Rotate, sway, and collect logic
    const time = state.clock.getElapsedTime();
    const playerX = -2; // Character's fixed screen position
    
    for (let i = 0; i < count; i++) {
      if (coinRefs.current[i]) {
        if (!coinRefs.current[i].userData.collected) {
          coinRefs.current[i].rotation.y += 3 * delta; // Constant rotation
          // Removed the individual index offset so the entire line sways up and down exactly together
          coinRefs.current[i].position.y = Math.sin(time * 5) * 0.2;
          
          // Collision detection against player
          const coinWorldX = ref.current.position.x + (i * 0.5);
          const coinWorldY = yLevel + coinRefs.current[i].position.y;
          
          // Pick up the coin if the player gets close enough
          if (Math.hypot(coinWorldX - playerX, coinWorldY - gameState.playerY) < 1.2) {
            coinRefs.current[i].userData.collected = true;
            coinRefs.current[i].userData.burstTime = 0;
            gameState.score += 1;
            sounds.coin.play();
          }
        } else {
          // Play pop burst shimmering animation
          coinRefs.current[i].userData.burstTime += delta;
          const bt = coinRefs.current[i].userData.burstTime;
          if (bt < 0.2) {
            coinRefs.current[i].scale.setScalar(1 + (bt * 10)); // Grow rapidly
            coinRefs.current[i].position.y += bt * 2; // Float up slightly
            coinRefs.current[i].rotation.y += 20 * delta; // Spin extremely fast
          } else {
            coinRefs.current[i].visible = false; // Hide completely after burst
          }
        }
      }
    }
  });

  return (
    <group ref={ref} position={[initialX, yLevel, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} ref={(el) => coinRefs.current[i] = el} position={[i * 0.5, 0, 0]}>
          <primitive object={clonedCoins[i]} scale={0.24} />
        </group>
      ))}
    </group>
  );
};

export const InfinitePlatform = () => {
  const groupRef = useRef();
  
  // Load the FBX platform model
  const fbx = useFBX('/platform.fbx');
  
  // Dynamic state for the exact mathematical length of your FBX
  const [actualLength, setActualLength] = useState(gameState.platformLength);
  
  // Apply shadows to the loaded FBX
  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
  }, [fbx]);
  
  // Automatically calculate the exact width of your model so they snap together perfectly
  useEffect(() => {
    if (fbx) {
      const tempGroup = new THREE.Group();
      const cloned = fbx.clone();
      cloned.scale.set(0.2, 0.2, 0.2);
      cloned.rotation.set(-Math.PI / 2, 0, 0);
      tempGroup.add(cloned);
      
      tempGroup.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(tempGroup);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      // If valid, use the exact pixel width along the X-axis for our tiling!
      if (size.x > 0) {
        // Subtract a small overlap (e.g., 0.3) to force them slightly closer together and hide the gap
        setActualLength(size.x - 0.3);
      }
    }
  }, [fbx]);
  
  useFrame((state, delta) => {
    // Gradually increase game speed over time
    if (gameState.speed < gameState.maxSpeed) {
      gameState.speed += gameState.speedIncrement * delta;
    }
  });

  return (
    <>
      {actualLength > 0 && (
         <group>
           {/* Starting solid runway so player doesn't instantly die, followed by looping segmented clusters */}
           <GroundPlatform initialX={0} initialCount={5} model={fbx} actualPlatformWidth={actualLength} />
           <GroundPlatform initialX={actualLength * 5 + 6} initialCount={2} model={fbx} actualPlatformWidth={actualLength} />
           <GroundPlatform initialX={actualLength * 7 + 13} initialCount={3} model={fbx} actualPlatformWidth={actualLength} />
           <GroundPlatform initialX={actualLength * 10 + 21} initialCount={2} model={fbx} actualPlatformWidth={actualLength} />
         </group>
      )}
      
      {/* Floating platform generation overlay */}
      {actualLength > 0 && (
        <group>
          <FloatingPlatform initialX={30} initialY={1} model={fbx} actualPlatformWidth={actualLength} />
          <FloatingPlatform initialX={60} initialY={0.5} model={fbx} actualPlatformWidth={actualLength} />
          <FloatingPlatform initialX={90} initialY={2.5} model={fbx} actualPlatformWidth={actualLength} />
          <FloatingPlatform initialX={120} initialY={-0.5} model={fbx} actualPlatformWidth={actualLength} />
          
          <CoinSpawner initialX={20} />
          <CoinSpawner initialX={40} />
          <CoinSpawner initialX={60} />
          <CoinSpawner initialX={80} />
          <CoinSpawner initialX={100} />
          <CoinSpawner initialX={120} />
        </group>
      )}
    </>
  );
};

useFBX.preload('/platform.fbx');
useGLTF.preload('/Goldcoin.glb');
