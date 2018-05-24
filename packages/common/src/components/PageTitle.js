import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { compose } from 'recompose';

export const PageTitleComponent = ({ space, kapp, parts }) => {
  const title = parts
    .concat([kapp && kapp.name, space.name, 'kinops'])
    .filter(item => !!item)
    .join(' | ');

  return <DocumentTitle title={title} />;
};

export const mapStateToProps = state => ({
  space: state.app.space || 'Home',
  kapp: state.app.kapps.find(kapp => kapp.slug === state.app.config.kappSlug),
});

export const mapDispatchToProps = {};

export const PageTitle = compose(connect(mapStateToProps, mapDispatchToProps))(
  PageTitleComponent,
);
