import React from 'react';
import { graphql } from 'gatsby';
import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import ArticleItem from '../components/article-item';

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout>
      <SEO title="All posts" />
      <div className="mb-8">
        <Bio />
      </div>
      <div>
        {posts.map(({ node }) => (
          <ArticleItem
            key={node.fields.slug}
            title={node.frontmatter.title || node.fields.slug}
            slug={node.fields.slug}
            readingTime={node.fields.readingTime.text}
            excerpt={node.excerpt}
            frontmatter={node.frontmatter}
          />
        ))}
      </div>
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        social {
          twitter
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            emoji
          }
        }
      }
    }
  }
`;
