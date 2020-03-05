import React from 'react';

const RssLink = () => (
  <a href="/rss.xml">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g fill="currentColor">
        <circle fill="currentColor" cx="3" cy="13" r="2" />{' '}
        <path
          fill="currentColor"
          d="M15,15h-2.7C12.3,8.8,7.2,3.7,1,3.7V1C8.7,1,15,7.3,15,15z"
        />{' '}
        <path
          data-color="color-2"
          d="M10.3,15H7.7c0-3.7-3-6.7-6.7-6.7V5.7C6.1,5.7,10.3,9.9,10.3,15z"
        />
      </g>
    </svg>
  </a>
);

export default RssLink;
