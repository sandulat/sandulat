import React from 'react';
import { darkModeStorageKey, darkModeClass } from './theme';

const HTML = ({
  htmlAttributes,
  postBodyComponents,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
}) => (
  <html {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {headComponents}
    </head>
    <body className="bg-dark-purple-100 dark:bg-black" {...bodyAttributes}>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              (function() {

                try {
                  var darkMode = window.localStorage.getItem('${darkModeStorageKey}');

                  window.darkMode = darkMode === 'true' || darkMode === null;

                  if (window.darkMode) {
                    document.documentElement.classList.add('${darkModeClass}');
                  }
                } catch (err) { }
              })();
            `,
        }}
      />
      {preBodyComponents}
      <div
        key={`body`}
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {postBodyComponents}
    </body>
  </html>
);

export default HTML;
