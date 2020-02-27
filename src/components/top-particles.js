import React from 'react';
import Particles from 'react-particles-js';

const TopParticles = props => (
  <Particles
    {...props}
    params={{
      particles: {
        line_linked: {
          enable: false,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1,
        },
        size: {
          value: 2,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: 'bottom',
          random: false,
          straight: true,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
        number: {
          value: 340,
          density: {
            enable: true,
            value_area: 800,
          },
        },
      },
    }}
  />
);

export default TopParticles;
