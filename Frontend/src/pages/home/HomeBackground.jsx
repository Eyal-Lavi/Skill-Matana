import React from 'react';
import Spline from '@splinetool/react-spline';

function HeroBackground() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      pointerEvents: 'auto',
      overflow: 'hidden',
      zIndex: 0, 
    }}>
      <Spline
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
        scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9))
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default HeroBackground;
