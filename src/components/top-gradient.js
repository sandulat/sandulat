import React from 'react';

const TopGradient = props => (
  <div
    {...props}
    style={{
      background: `linear-gradient(180deg, rgba(60, 54, 107, 0.6) 0%, rgba(60, 54, 107, 0.2) 45%, #1d1d26 100%)`,
    }}
  />
);

export default TopGradient;
