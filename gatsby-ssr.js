const React = require('react');
const ThemeProvider = require('./src/theme').ThemeProvider;

exports.wrapPageElement = ({ element, props }) => {
  return <ThemeProvider {...props}>{element}</ThemeProvider>;
};
