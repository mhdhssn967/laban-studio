import React from 'react';
import { EffectComposer, Bloom, N8AO, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const PostProcessingEffects = ({ enable = true }) => {
  if (!enable) return null;

  return (
    <EffectComposer multisampling={0} disableNormalPass={false}>
      {/* High-quality anti-aliasing */}
      <SMAA />
      
      {/* N8AO is the modern, high-performance ambient occlusion that replaces older SSAO */}
      <N8AO 
        aoRadius={0.5} 
        intensity={2} 
        quality="high"
      />
      
      {/* Subtle bloom for bright highlights without blowing out the image */}
      <Bloom 
        intensity={0.4} 
        luminanceThreshold={0.9} 
        luminanceSmoothing={0.1} 
        blendFunction={BlendFunction.SCREEN} 
      />
    </EffectComposer>
  );
};
