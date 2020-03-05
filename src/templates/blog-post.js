import React, { useContext } from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Signup from '../components/signup';
import { ThemeContext } from '../theme';

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark;

  const { previous, next } = pageContext;

  const featuredImage = post.frontmatter.featuredImage;

  const { theme } = useContext(ThemeContext);

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        previewImage={featuredImage}
      />
      <article className="pt-12 md:pt-5">
        <header className="mb-5">
          <h1 className="text-2xl font-medium text-dark-purple-500 dark:text-dark-purple-100">
            {post.frontmatter.title}
          </h1>
          <small className="text-dark-purple-400">
            {post.frontmatter.date} — {post.fields.readingTime.text}
          </small>
        </header>
        <section
          className="text-lg font-light leading-relaxed tracking-wide whitespace-pre-line md:leading-loose text-dark-purple-500 dark:text-dark-purple-200 md:text-base"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <hr className="my-10" />
        <div className="relative">
          <div className="absolute z-10 hidden mt-8 -ml-40 pointer-events-none select-none pin-y md:block">
            <Image
              fixed={
                theme.darkMode
                  ? data.rocketDark.childImageSharp.fixed
                  : data.rocketLight.childImageSharp.fixed
              }
            />
          </div>
          <Signup />
        </div>
        <hr className="my-10" />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav className="my-5">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    rocketLight: file(relativePath: { eq: "rocket-light.png" }) {
      childImageSharp {
        fixed(width: 300) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    rocketDark: file(relativePath: { eq: "rocket-dark.png" }) {
      childImageSharp {
        fixed(width: 300) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        featuredImage {
          childImageSharp {
            fixed(width: 800) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
      fields {
        readingTime {
          text
        }
      }
    }
  }
`;
