import React from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { convertKitForm } from '../constants/convert-kit';

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark;

  const { previous, next } = pageContext;

  const featuredImage = post.frontmatter.featuredImage;

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        previewImage={featuredImage}
      />
      <article className="pt-5">
        <header className="mb-5">
          <h1 className="text-2xl text-dark-purple-100 font-medium">
            {post.frontmatter.title}
          </h1>
          <small className="text-dark-purple-400">
            {post.frontmatter.date} — {post.fields.readingTime.text}
          </small>
        </header>
        <section
          className="text-dark-purple-200 font-light tracking-wide leading-loose whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <hr className="my-10" />
        <div className="relative">
          <div className="absolute pin-y -ml-40 mt-8 z-10 hidden md:block pointer-events-none select-none">
            <Image fixed={data.rocket.childImageSharp.fixed} />
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: convertKitForm,
            }}
          />
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
    rocket: file(absolutePath: { regex: "/rocket.png/" }) {
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
