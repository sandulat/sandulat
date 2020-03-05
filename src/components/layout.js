import React, { useContext } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import { ThemeContext } from '../theme';
import Logo from './logo';
import TopGradient from './top-gradient';
import TopParticles from './top-particles';
import TwitterLink from './twitter-link';
import RssLink from './rss-link';
import DarkModeToggle from './dark-mode-toggle';
import '../styles/main.css';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      planetDark: file(relativePath: { eq: "planet-dark.png" }) {
        childImageSharp {
          fixed(width: 300) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      planetLight: file(relativePath: { eq: "planet-light.png" }) {
        childImageSharp {
          fixed(width: 320) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          title
          social {
            twitter
          }
        }
      }
    }
  `);

  const { theme, toggleDarkMode } = useContext(ThemeContext);

  const { title, social } = data.site.siteMetadata;

  return (
    <div className="relative">
      <div
        className={`${
          theme.loaded ? 'opacity-100' : 'opacity-0'
        } absolute top-0 w-full h-40 transition-opacity duration-500`}
      >
        {theme.loaded && (
          <TopGradient
            className="absolute top-0 z-10 w-full h-full"
            dark={theme.darkMode}
          />
        )}

        <TopParticles
          className="absolute top-0 z-0 w-full h-full"
          dark={theme.darkMode}
        />
        <div className="relative z-0 h-full overflow-hidden lg:overflow-visible">
          <div className="container relative mx-auto">
            <div
              className={`${
                !theme.darkMode ? 'opacity-50 md:opacity-100' : ''
              } absolute right-0 -mt-12 select-none -mr-15`}
            >
              <Image
                fixed={
                  theme.darkMode
                    ? data.planetDark.childImageSharp.fixed
                    : data.planetLight.childImageSharp.fixed
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container relative z-10 p-5 mx-auto">
        <header className="flex items-center mb-5">
          <div className="mr-2">
            <Logo title={title} />
          </div>
          <div
            className={`${
              theme.loaded ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          >
            <DarkModeToggle active={theme.darkMode} onToggle={toggleDarkMode} />
          </div>
        </header>
        <main>{children}</main>
        <footer className="flex items-center justify-between text-xs tracking-wide text-dark-purple-500 dark:text-dark-purple-300">
          <div>
            © {new Date().getFullYear()}
            {` `}
            <Link to={`/`}>{title}</Link>
          </div>
          <ul className="flex items-center">
            <li className="mr-4">
              <RssLink />
            </li>
            <li>
              <TwitterLink twitter={social.twitter} />
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
