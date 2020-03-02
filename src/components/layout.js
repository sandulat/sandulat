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
      <div className="absolute top-0 w-full h-40">
        <TopGradient className="absolute top-0 z-10 w-full h-full" />
        <TopParticles className="absolute top-0 z-0 w-full h-full" />
        <div className="relative z-0 h-full overflow-hidden lg:overflow-visible">
          <div className="container relative mx-auto">
            <div className="absolute right-0 -mt-12 select-none -mr-15">
              <Image fixed={data.planet.childImageSharp.fixed} />
            </div>
          </div>
        </div>
      </div>
      <div className="container relative z-10 p-5 mx-auto">
        <header className="mb-5">
          <Logo title={title} />
        </header>
        <main>{children}</main>
        <footer className="flex items-center justify-between text-xs tracking-wide text-dark-purple-300">
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
