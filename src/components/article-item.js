import React from 'react';
import { Link } from 'gatsby';

const ArticleItem = ({ title, slug, frontmatter, readingTime, excerpt }) => (
  <Link title={title} to={slug} className="group">
    <article className="p-5 bg-dark-purple-700 rounded mb-8 shadow-lg transition transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
      <header className="mb-1">
        <small className="text-dark-purple-400">{frontmatter.date} — {readingTime}</small>
        <h3 className="text-2xl font-medium transition-colors duration-300 text-indigo-400 group-hover:text-indigo-500">{title}</h3>
      </header>
      <section>
        <p
          className="text-dark-purple-300 text-sm tracking-wider font-light"
          dangerouslySetInnerHTML={{
            __html: frontmatter.description || excerpt,
          }}
        />
      </section>
    </article>
  </Link>
);

export default ArticleItem;
