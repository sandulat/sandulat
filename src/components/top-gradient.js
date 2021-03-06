import React from 'react';

const TopGradient = ({ dark, ...props }) => (
  <div
    {...props}
    style={{
      background: dark
        ? `linear-gradient(180deg, rgba(60, 54, 107, 0.6) 0%, rgba(29, 29, 38, 0.4) 65%, rgba(29, 29, 38, 1) 100%)`
        : `linear-gradient(180deg, rgba(213, 63, 140, 0.3) 0%, rgba(237, 236, 241, 0.45) 65%, rgba(237, 236, 241, 1) 100%)`,
    }}
  />
);

export default TopGradient;
