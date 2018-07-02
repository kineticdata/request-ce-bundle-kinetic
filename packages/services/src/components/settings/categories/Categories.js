import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import { Utils, PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsCategories';

const mapStateToProps = state => ({
  categories: state.settings.categories.data,
});

const mapDispatchToProps = {
  updateCategories: actions.updateCategories,
};

export const SettingsContainer = ({ updateCategories, inputs, setInputs }) => (
  <div>
    <PageTitle parts={['Space Settings']} />
    <div className="page-container page-container--space-settings">
      <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/kapps/services/settings">settings</Link> /{` `}
            </h3>
            <h1>Categories</h1>
          </div>
        </div>
        <section>Categories here</section>
      </div>
    </div>
  </div>
);

export const SpaceSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchServicesSettings();
    },
  }),
)(SettingsContainer);
