import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from '../shared/PageTitle';
import { Link } from '@reach/router';
import { I18n } from '@kineticdata/react';

export const SampleSettingsComponent = props => (
  <Fragment>
    <PageTitle parts={['Sample Settings']} />
    <div className="page-container">
      <div className="page-panel page-panel--scrollable">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../../">
                <I18n>survey</I18n>
              </Link>{' '}
              /{` `}
              <Link to="../">
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
            </h3>
            <h1>
              <I18n>Sample</I18n>
            </h1>
          </div>
        </div>
        <div>
          <p>Sample Settings Page</p>
        </div>
      </div>
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => ({
  kapp: state.app.kapp,
});

export const mapDispatchToProps = {};

export const SampleSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {},
  }),
)(SampleSettingsComponent);
