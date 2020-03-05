import React from 'react';
import Particles from 'react-particles-js';

const TopParticles = ({ dark, ...props }) => (
  <Particles
    {...props}
    params={{
      particles: {
        color: {
          value: dark ? '#ffffff' : '#b83280',
        },
        line_linked: {
          enable: false,
          distance: 150,
          opacity: dark ? 0.4 : 1,
          width: 10,
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
          value: dark ? 340 : 500,
          density: {
            enable: true,
            value_area: dark ? 800 : 300,
          },
        },
      },
    }}
  />
);

export default TopParticles;
