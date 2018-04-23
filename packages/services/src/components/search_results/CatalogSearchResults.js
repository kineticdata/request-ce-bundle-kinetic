import React from 'react';
import { KappLink as Link, PageTitle } from 'common';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';
import { ServiceCard } from '../shared/ServiceCard';
import { CatalogSearchContainer } from '../shared/CatalogSearchContainer';

export const CatalogSearchResults = ({ query, forms }) => (
  <div>
    <PageTitle parts={[`Search: ${query}`]} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--search-results">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">services</Link> / search results
          </h3>
          <h1>{query}</h1>
        </div>
      </div>
      <div className="search-results">
        <div className="select search-results__select">
          <CatalogSearchContainer />
        </div>
        <div className="search-results__list">
          {forms.size > 0 ? (
            <ul>
              {forms.map(form => (
                <li key={form.slug}>
                  <ServiceCard path={`/forms/${form.slug}`} form={form} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state empty-state--wally">
              <h5>No Results for '{query}'</h5>
              <img src={wallyMissingImage} alt="Missing Wally" />
              <h6>
                Make sure words are spelled correctly, use less specific or
                different keywords
              </h6>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
