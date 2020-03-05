import React from 'react';
import AppContainer from './src/components/app-container';

export const wrapRootElement = ({ element }) => (
  <AppContainer>{element}</AppContainer>
);
