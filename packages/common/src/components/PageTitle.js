import React from 'react';
import DocumentTitle from 'react-document-title';
import { I18n } from '@kineticdata/react';

export const PageTitle = ({ pageTitleParts }) => {
  return (
    <I18n
      render={translate => {
        const title = (pageTitleParts || [])
          .map(p => translate(p))
          .filter(item => !!item)
          .join(' | ');

        return <DocumentTitle title={title} />;
      }}
    />
  );
};
