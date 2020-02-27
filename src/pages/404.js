import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout title={siteTitle}>
      <SEO title="404: Not Found" />
      <div class="my-10">
        <h1 className="text-dark-purple-100 font-medium text-3xl mb-2">
          404 Not Found
        </h1>
        <div className="text-sm leading-loose">
          <p className="text-dark-purple-400">
            The page{' '}
            <span className="bg-dark-purple-900 font-medium rounded py-px px-1 opacity-75">
              {location.pathname}
            </span>{' '}
            doesn't exist.
          </p>
          <Link to={'/'}>Go Home.</Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
