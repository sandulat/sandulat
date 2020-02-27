import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
        childImageSharp {
          fixed(width: 70, height: 70) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          description
          social {
            twitter
          }
        }
      }
    }
  `);

  const { author, social, description } = data.site.siteMetadata;

  return (
    <div className="flex items-center">
      <a href="/" className="flex mr-3"> 
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={author}
          className="rounded-full shadow"
        />
      </a>
      <div className="text-dark-purple-300 text-xs tracking-wide">
        <p>
          By{' '}
          <a
            href={`https://twitter.com/${social.twitter}`}
            className="font-medium"
          >
            {author}
          </a>.
        </p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Bio;
