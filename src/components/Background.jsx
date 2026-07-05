import React from 'react';
import { useTexture } from '@react-three/drei';

export const BackgroundImage = () => {
  const texture = useTexture('/newbg.png');
  return (
    <mesh position={[0, 0, -20]}>
      {/* Large enough to cover the camera's view frustum */}
      <planeGeometry args={[160, 100]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
    </mesh>
  );
};
