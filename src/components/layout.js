import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import Logo from './logo';
import TopGradient from './top-gradient';
import TopParticles from './top-particles';
import TwitterLink from './twitter-link';
import '../styles/main.css';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      planet: file(absolutePath: { regex: "/planet.png/" }) {
        childImageSharp {
          fixed(width: 300) {
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

  const { title, social } = data.site.siteMetadata;

  return (
    <div className="relative">
      <div className="h-40 w-full absolute top-0">
        <TopGradient className="h-full w-full absolute top-0 z-10" />
        <TopParticles className="h-full w-full absolute top-0 z-0" />
        <div className="h-full relative overflow-hidden lg:overflow-visible z-0">
          <div className="container mx-auto relative">
            <div className="absolute right-0 -mt-12 -mr-15 select-none">
              <Image fixed={data.planet.childImageSharp.fixed} />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-5 relative z-10">
        <header className="mb-5">
          <Logo title={title} />
        </header>
        <main>{children}</main>
        <footer className="text-xs text-dark-purple-300 tracking-wide flex items-center justify-between">
          <div>
            © {new Date().getFullYear()}
            {` `}
            <Link to={`/`}>{title}</Link>
          </div>
          <div>
            <TwitterLink twitter={social.twitter} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
