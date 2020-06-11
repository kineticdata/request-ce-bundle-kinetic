import React from 'react';
import { Link } from '@reach/router';
import { I18n } from '@kineticdata/react';

const processRelatedItem = relatedItem => {
  switch (relatedItem.type) {
    case 'Submission':
      return {
        key: relatedItem.key,
        category: `${relatedItem.item.form.kapp.name} / ${
          relatedItem.item.form.name
        } / Submission`,
        label: relatedItem.item.label,
        path: `/kapps/${relatedItem.item.form.kapp.slug}/forms/${
          relatedItem.item.form.slug
        }/submissions/${relatedItem.item.id}`,
      };
    case 'Form':
      return {
        key: relatedItem.key,
        category: `${relatedItem.item.kapp.name} / Form`,
        label: relatedItem.item.name,
        path: `/kapps/${relatedItem.item.kapp.slug}/forms/${
          relatedItem.item.slug
        }`,
      };
    case 'Kapp':
      return {
        key: relatedItem.key,
        category: `Kapp`,
        label: relatedItem.item.name,
        path: `/kapps/${relatedItem.item.slug}`,
      };
    case 'Datastore Submission':
      return {
        key: relatedItem.key,
        category: `Datastore / ${relatedItem.item.form.name} / Submission`,
        label: relatedItem.item.label,
        path: `/datastore/forms/${relatedItem.item.form.slug}/submissions/${
          relatedItem.item.id
        }`,
      };
    case 'Datastore Form':
      return {
        key: relatedItem.key,
        category: `Datastore / Form`,
        label: relatedItem.item.name,
        path: `/datastore/forms/${relatedItem.item.slug}`,
      };
    case 'User':
      return {
        key: relatedItem.key,
        category: `User`,
        label: relatedItem.item.displayName || relatedItem.item.username,
        path: `/profile/${relatedItem.key}`,
      };
    case 'Team':
      return {
        key: relatedItem.key,
        category: `Team`,
        label: relatedItem.item.name,
        path: `/teams/${relatedItem.key}`,
      };
    case 'Space':
      return {
        key: relatedItem.key,
        category: `Space`,
        label: relatedItem.item.name,
        path: `/`,
      };
    default:
      return null;
  }
};

export const RelatedItemsList = props => {
  const relatedItems = props.discussion.relatedItems
    .map(processRelatedItem)
    .filter(i => i);
  return (
    <div className="related-items-list-wrapper">
      <div className="related-items-heading">
        <I18n>Related Items</I18n>
      </div>
      {relatedItems.size === 0 && (
        <div className="related-items-empty-state">
          <I18n>There are no related items</I18n>
        </div>
      )}
      <ul className="related-items-list">
        {relatedItems.map(item => {
          return (
            <li key={item.key}>
              <Link to={item.path} onClick={props.close}>
                <span>{item.category}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
