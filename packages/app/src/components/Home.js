import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { PageTitle } from './shared/PageTitle';
import { addToast, selectVisibleKapps } from 'common';
import { I18n, fetchForms } from '@kineticdata/react';

export const HomeComponent = ({
  space,
  kapp,
  forms,
  visibleKapps,
  profile,
  pathname,
}) => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container container">
      <div className="page-panel">
        <h1>
          <I18n>{kapp ? kapp.name : space.name}</I18n>
        </h1>
        <section className="mt-3">
          <hr />
          <div>
            <I18n>Welcome</I18n>{' '}
            <strong>{profile.displayName || profile.username}</strong>{' '}
          </div>
        </section>
        {!kapp ? (
          <Fragment>
            <section className="mt-5">
              <h2 className="section__title">
                <span>
                  <I18n>Kapps</I18n>
                </span>
              </h2>
              <ul>
                {visibleKapps.map(k => (
                  <li key={k.slug}>
                    <Link to={`/kapps/${k.slug}`}>
                      <I18n>{k.name}</I18n>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section className="mt-5">
              <h2 className="section__title">
                <span>
                  <I18n>General</I18n>
                </span>
              </h2>
              <ul>
                <li>
                  <Link to="/discussions">
                    <I18n>Discussions</I18n>
                  </Link>
                </li>
                <li>
                  <Link to="/settings">
                    <I18n>Settings</I18n>
                  </Link>
                </li>
              </ul>
            </section>
          </Fragment>
        ) : (
          <Fragment>
            <section className="mt-5">
              <div className="alert alert-warning">
                <I18n>
                  This Kapp does not have a Bundle Package attribute set.
                </I18n>
              </div>
            </section>
            {forms && (
              <section className="mt-5">
                <h2 className="section__title">
                  <span>
                    <I18n>Forms</I18n>
                  </span>
                </h2>
                <ul>
                  {forms.map(f => (
                    <li key={f.slug}>
                      <Link to={`/kapps/${kapp.slug}/forms/${f.slug}`}>
                        <I18n>{f.name}</I18n>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </Fragment>
        )}
      </div>
    </div>
  </Fragment>
);

export const mapStateToProps = state => {
  return {
    space: state.app.space,
    kapps: state.app.kapps,
    kapp: state.app.kapp,
    profile: state.app.profile,
    pathname: state.router.location.pathname,
    visibleKapps: selectVisibleKapps(state),
  };
};

export const Home = compose(
  connect(mapStateToProps),
  withState('forms', 'setForms', null),
  withHandlers({
    fetchFormsRequest: props => () => {
      fetchForms({ kappSlug: props.kapp.slug }).then(response => {
        if (response.error) {
          addToast({ message: 'Failed to load forms', severity: 'danger' });
        } else {
          props.setForms(response.forms);
        }
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      if (this.props.kapp) {
        this.props.fetchFormsRequest();
      }
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.kapp &&
        (!prevProps.kapp || prevProps.kapp.slug !== this.props.kapp.slug)
      ) {
        this.props.fetchFormsRequest();
      }
    },
  }),
)(HomeComponent);
