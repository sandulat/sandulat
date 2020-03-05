import React from 'react';
import { ThemeProvider } from './src/theme';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
