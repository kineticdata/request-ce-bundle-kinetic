import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { I18n } from '../../../app/src/I18nProvider';

export const PageTitleComponent = ({ space, kapp, parts }) => {
  return (
    <I18n
      render={translate => {
        const title = parts
          .map(p => translate(p))
          .concat([
            kapp && translate(kapp.name),
            translate(space.name),
            'kinops',
          ])
          .filter(item => !!item)
          .join(' | ');

        return <DocumentTitle title={title} />;
      }}
    />
  );
};

export const mapStateToProps = state => ({
  space: state.app.space || 'Home',
  kapp: state.app.kapps.find(kapp => kapp.slug === state.app.config.kappSlug),
});

export const mapDispatchToProps = {};

export const PageTitle = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PageTitleComponent);
