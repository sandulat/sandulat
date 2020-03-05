import React, { useEffect, useReducer } from 'react';
import 'prism-themes/themes/prism-material-dark.css';

export const darkModeStorageKey = 'dark-mode';

export const darkModeClass = 'mode-dark';

const bodyHasDarkMode = () =>
  document.documentElement.classList.contains(darkModeClass);

const actionTypes = {
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_DARK_MODE: 'SET_DARK_MODE',
};

const themeState = {
  darkMode: false,
  loaded: false,
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_DARK_MODE:
      return { ...state, darkMode: bodyHasDarkMode() };
    case actionTypes.SET_DARK_MODE:
      return { ...state, darkMode: action.darkMode };
    case actionTypes.MARK_THEME_AS_LOADED:
      return { ...state, loaded: true };
    default:
      throw new Error();
  }
};

const toggleDarkMode = ({ theme, dispatch }) => {
  document.documentElement.classList.toggle(darkModeClass);

  window.localStorage.setItem(darkModeStorageKey, !theme.darkMode);

  dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
};

export const ThemeContext = React.createContext(themeState);

export const ThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, themeState);

  useEffect(() => {
    const darkMode = window.localStorage.getItem(darkModeStorageKey);

    const isDark = darkMode === 'true' || !darkMode;

    if (isDark) {
      document.documentElement.classList.add(darkModeClass);
    }

    dispatch({ type: actionTypes.SET_DARK_MODE, darkMode: isDark });

    dispatch({ type: actionTypes.MARK_THEME_AS_LOADED });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme || themeState,
        toggleDarkMode: () => toggleDarkMode({ theme, dispatch }),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
