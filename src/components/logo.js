import React from 'react';
import { Link } from 'gatsby';

const Logo = ({ title }) => (
  <Link
    className="flex items-center inline-block h-6 px-3 text-xs font-medium tracking-widest text-pink-900 uppercase align-top transition-colors duration-300 bg-pink-400 rounded-full shadow dark:text-indigo-300 dark:bg-indigo-800 hover:bg-pink-500 hover:text-pink-900 dark-hover:bg-indigo-900 dark-hover:text-indigo-400"
    to={`/`}
    title={title}
  >
    {title}
  </Link>
);

export default Logo;
