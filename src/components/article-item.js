import React from 'react';
import { Link } from 'gatsby';

const ArticleItem = ({ title, slug, frontmatter, readingTime, excerpt }) => (
  <Link title={title} to={slug} className="group">
    <article className="p-5 mb-8 transition transition-transform duration-300 ease-in-out transform bg-gray-100 rounded shadow-lg dark:bg-dark-purple-700 hover:-translate-y-1">
      <header className="mb-1">
        <small className="text-dark-purple-400">
          {frontmatter.date} — {readingTime}
        </small>
        <h3 className="text-2xl font-medium transition-colors duration-300 text-dark-purple-500 dark:text-indigo-400 group-hover:text-pink-600 dark-group-hover:text-indigo-500">
          {frontmatter.emoji ? `${frontmatter.emoji} ` : null} {title}
        </h3>
      </header>
      <section>
        <p
          className="text-sm font-light tracking-wider text-dark-purple-500 dark:text-dark-purple-300"
          dangerouslySetInnerHTML={{
            __html: frontmatter.description || excerpt,
          }}
        />
      </section>
    </article>
  </Link>
);

export default ArticleItem;
