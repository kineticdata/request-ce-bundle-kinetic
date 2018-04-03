import React from 'react';
import { KappLink as Link, PageTitle } from 'common';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';
import { ServiceCard } from '../ServiceCard';
import { CatalogSearchContainer } from './CatalogSearchContainer';

export const CatalogSearchResults = ({ query, forms }) => (
  <div>
    <PageTitle parts={[`Search: ${query}`]} />
    <div className="services-bar">
      <span className="bordercolor" />
    </div>

    <div className="search-results-container container">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">services</Link> / search results
          </h3>
          <h1>{query}</h1>
        </div>
      </div>
      <div className="search-results-wrapper">
        <div className="select">
          <CatalogSearchContainer />
        </div>
        <div className="search-results-list">
          {forms.size > 0 ? (
            <ul>
              {forms.map(form => (
                <li key={form.slug}>
                  <ServiceCard path={`/forms/${form.slug}`} form={form} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="wally-empty-state">
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
