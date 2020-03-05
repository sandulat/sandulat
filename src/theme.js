import React from 'react';
import Cookies from 'js-cookie';
import 'prism-themes/themes/prism-material-dark.css';

const darkModeClass = 'mode-dark';

const darkModeCookieName = 'dark-mode';

const darkModeCookie = Cookies.get(darkModeCookieName);

if (darkModeCookie === 'true' || darkModeCookie === undefined) {
  document.documentElement.classList.add(darkModeClass);
}

const bodyHasDarkMode = () =>
  document.documentElement.classList.contains(darkModeClass);

const actionTypes = {
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
};

export const themeState = {
  darkMode: bodyHasDarkMode(),
};

export const themeReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_DARK_MODE:
      return { ...state, darkMode: bodyHasDarkMode() };
    default:
      throw new Error();
  }
};

export const toggleDarkMode = ({ theme, dispatch }) => {
  document.documentElement.classList.toggle(darkModeClass);

  Cookies.set(darkModeCookieName, !theme.darkMode);

  dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
};

export const ThemeContext = React.createContext(null);
