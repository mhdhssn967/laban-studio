import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { gameState, sounds } from '../gameLogic';


export const Player = () => {
  const group = useRef();
  const { scene, animations } = useGLTF('/laban_new.glb?v=7'); 
  // Strip root motion from animations so the character doesn't drift forward during the jump
  const strippedAnimations = useMemo(() => {
    return animations.map(clip => {
      const newClip = clip.clone();
      newClip.tracks = newClip.tracks.filter(track => {
        const name = track.name.toLowerCase();
        // Remove position tracks for the hips/root to disable root motion
        return !(name.includes('hips.position') || name.includes('root.position') || name.includes('pelvis.position'));
      });
      return newClip;
    });
  }, [animations]);

  const { actions } = useAnimations(strippedAnimations, group);
  const velocity = useRef(0);
  const isJumping = useRef(false);
  const jumpCount = useRef(0);
  const gravity = -20;
  const jumpStrength = 12;
  const floorY = -2.3; // Raised slightly because the platform scale was increased

  const getAction = (name) => {
    if (!actions) return null;
    const key = Object.keys(actions).find(k => k.toLowerCase().includes(name.toLowerCase()));
    return key ? actions[key] : null;
  };
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const runAction = getAction('run');
    if (runAction) {
      runAction.reset().fadeIn(0.2).play();
    }
    
    const attemptJump = () => {
      if (jumpCount.current < 2 && gameState.gameStarted && !gameState.gameOver) {
        if (!sounds.bgm.playing()) {
          sounds.bgm.play(); // Start bgm on first jump
        }
        sounds.jump.play();
        
        isJumping.current = true;
        velocity.current = jumpStrength; // Apply fresh jump force
        jumpCount.current += 1;
        
        const runAction = getAction('run');
        if (runAction) runAction.fadeOut(0.2);
        
        const fallAction = getAction('fall');
        if (fallAction) fallAction.fadeOut(0.2);
        
        const jumpAction = getAction('jump');
        if (jumpAction) {
          jumpAction.reset().fadeIn(0.1).play();
          jumpAction.setLoop(THREE.LoopOnce, 1);
          jumpAction.clampWhenFinished = true;
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        attemptJump();
      }
    };
    
    const handlePointerDown = (e) => {
      // Don't jump if the user is tapping a UI button (Start / Try Again)
      if (e.target.tagName && e.target.tagName.toLowerCase() === 'button') return;
      // Also ignore SVG paths within buttons
      if (e.target.closest && e.target.closest('button')) return;
      attemptJump();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [actions, scene]);
  
  useFrame((state, delta) => {
    if (!group.current) return;
    
    if (!gameState.gameStarted) {
      const runAction = getAction('run');
      if (runAction) runAction.setEffectiveTimeScale(0);
      return;
    }
    
    // Dynamically adjust the run animation speed to match the platform speed
    const runAction = getAction('run');
    if (runAction) {
      runAction.setEffectiveTimeScale(gameState.speed);
    }
    
    const allPlatforms = [...gameState.activeGroundPlatforms, ...gameState.activeFloatingPlatforms];
    
    if (isJumping.current) {
      velocity.current += gravity * delta;
      const prevY = group.current.position.y;
      group.current.position.y += velocity.current * delta;
      const nextY = group.current.position.y;
      
      let landed = false;
      let targetFloor = floorY;

      // Check collision with ALL platforms when falling
      if (velocity.current < 0) {
        const playerX = -2; // Hardcoded player position in App
        
        for (const plat of allPlatforms) {
          if (playerX >= plat.left - 0.5 && playerX <= plat.right + 0.5) { 
            const platSurface = plat.surfaceY; // Exact surface height of the specific platform
            
            // Check if player crossed the platform surface this frame
            if (prevY >= platSurface && nextY <= platSurface) {
               targetFloor = platSurface;
               landed = true;
               break;
            }
          }
        }
      }
      
      if (landed) {
        group.current.position.y = targetFloor;
        isJumping.current = false;
        velocity.current = 0;
        jumpCount.current = 0; // Reset jumps when we touch the ground
        
        const fallAction = getAction('fall');
        const jumpAction = getAction('jump');
        if (fallAction) fallAction.fadeOut(0.1);
        if (jumpAction) jumpAction.fadeOut(0.1);
        
        const runAction = getAction('run');
        if (runAction) runAction.reset().fadeIn(0.1).play();
      } else if (velocity.current < 0) {
        // Trigger fall animation if we reached the apex and are now falling
        const fallAction = getAction('fall');
        const jumpAction = getAction('jump');
        if (fallAction && !fallAction.isRunning()) {
          if (jumpAction) jumpAction.fadeOut(0.2);
          fallAction.reset().fadeIn(0.2).play();
        }
      }
    } else {
      // Check if we walked off any platform
      let supported = false;
      const playerX = -2;
      for (const plat of allPlatforms) {
        if (playerX >= plat.left - 0.5 && playerX <= plat.right + 0.5) {
          if (Math.abs(group.current.position.y - plat.surfaceY) < 0.1) {
            supported = true;
            break;
          }
        }
      }
      
      if (!supported) {
        isJumping.current = true;
        velocity.current = 0; // Fall straight down
        
        // If we fall off a ledge without jumping, we only get 1 jump in mid-air
        if (jumpCount.current === 0) jumpCount.current = 1; 
        
        const runAction = getAction('run');
        if (runAction) runAction.fadeOut(0.2);
        
        const fallAction = getAction('fall');
        if (fallAction) fallAction.reset().fadeIn(0.2).play();
      }
    }

    // Camera follow logic: subtly track the player's vertical position
    const heightAboveGround = group.current.position.y - floorY;
    // Move the camera up by only 30% of the player's jump height for a gentle effect
    const targetCameraY = 3.0 + (heightAboveGround * 0.3);
    // Smoothly interpolate the camera's Y position towards the target
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCameraY, 8 * delta);
    
    // Game Over Logic: If player falls into a gap and drops off screen
    if (group.current.position.y < -10 && !gameState.gameOver) {
      gameState.gameOver = true;
      gameState.speed = 0; // Freeze the environment
      sounds.fall.play(); // Play death sound
      sounds.bgm.stop(); // Instantly stop the background music
    }
    
    // Broadcast player's Y position for coin collision detection
    gameState.playerY = group.current.position.y;
  });
  return (
    <group ref={group} position={[-2, floorY, 0]}>
      <primitive object={scene} scale={2.2} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
};

useGLTF.preload('/laban_new.glb?v=7');
