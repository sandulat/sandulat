import React from 'react';
import { Link } from 'gatsby';

const Logo = ({ title }) => (
  <Link to={`/`} title={title}>
    <span className="px-3 py-1 text-xs font-medium tracking-widest text-indigo-300 uppercase transition-colors duration-300 bg-indigo-800 rounded-full shadow hover:bg-indigo-900 hover:text-indigo-400">
      {title}
    </span>
  </Link>
);

export default Logo;
