import React from 'react';

const TopGradient = props => (
  <div
    {...props}
    style={{
      background: `linear-gradient(180deg, rgba(60, 54, 107, 0.6) 0%, rgba(29, 29, 38, 0.4) 65%, rgba(29, 29, 38, 1) 100%)`,
    }}
  />
);

export default TopGradient;
