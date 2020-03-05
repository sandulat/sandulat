import React from 'react';
import { useReducer } from 'react';
import 'prism-themes/themes/prism-material-dark.css';
import {
  ThemeContext,
  themeState,
  themeReducer,
  toggleDarkMode,
} from '../theme';

const AppContainer = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, themeState);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleDarkMode: () => toggleDarkMode({ theme, dispatch }),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default AppContainer;
