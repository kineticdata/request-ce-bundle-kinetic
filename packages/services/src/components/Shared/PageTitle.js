import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { compose } from 'recompose';

export const PageTitleComponent = ({ space, parts }) => {
  const title = parts
    .concat(['Services', space.name, 'kinops'])
    .filter(item => !!item)
    .join(' | ');

  return <DocumentTitle title={title} />;
};

export const mapStateToProps = state => ({
  space: state.kinops.space || 'Home',
});

export const mapDispatchToProps = {};

export const PageTitle = compose(connect(mapStateToProps, mapDispatchToProps))(
  PageTitleComponent,
);
