import React from 'react';
import { Link } from 'gatsby';

const Logo = ({ title }) => (
  <Link to={`/`} title={title}>
    <span className="uppercase text-xs font-medium transition-colors duration-300 bg-indigo-800 hover:bg-indigo-900 text-indigo-300 hover:text-indigo-400 rounded-full px-3 py-1 tracking-widest shadow">
      {title}
    </span>
  </Link>
);

export default Logo;
