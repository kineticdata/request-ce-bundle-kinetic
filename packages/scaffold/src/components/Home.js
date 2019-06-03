import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose } from 'recompose';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

export const HomeComponent = ({ kapp, profile }) => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container container">
      <h1>
        <I18n>{kapp.name}</I18n>
      </h1>
      <section className="mt-4">
        <h2 className="section__title">
          <span>
            <I18n>Welcome</I18n>{' '}
            <strong>{profile.displayName || profile.username}</strong>{' '}
          </span>
        </h2>
      </section>
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => {
  return {
    kapp: state.app.kapp,
    profile: state.app.profile,
  };
};

export const mapDispatchToProps = {};

export const Home = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HomeComponent);
