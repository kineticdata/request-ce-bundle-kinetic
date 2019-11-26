import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose } from 'recompose';
import {
  selectCurrentKapp,
  ErrorNotFound,
  ErrorUnauthorized,
  Utils,
} from 'common';
import { PageTitle } from './shared/PageTitle';
import { Link } from '@reach/router';
import { CheckIn } from './CheckIn';
import { Feedback } from './Feedback';
import { Overhead } from './Overhead';
import { I18n } from '@kineticdata/react';
import logoImage from '../assets/images/logo.jpg';

export const DisplayMultipleComponent = ({
  navigate,
  location: { search, pathname },
  kapp,
  techBars,
  mode,
  hasTechBarDisplayRole,
}) => {
  return !hasTechBarDisplayRole ? (
    <ErrorUnauthorized />
  ) : (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        {logoImage && (
          <div
            className="logo-container"
            style={{ backgroundImage: `url(${logoImage})` }}
          />
        )}
        <div className="multiple-page-panel multiple-page-panel--display">
          {techBars &&
            techBars.map(tb => (
              <div key={tb.values['Id']}>
                {console.log(tb.values)}
                <div>
                  <span className="fa fa-fw fa-map-marker" />
                  <I18n>{tb.values['Name']}</I18n>
                </div>
                <CheckIn
                  techBar={tb}
                  crosslink={
                    search.includes('crosslink') ||
                    pathname.includes('crosslink')
                  }
                />
              </div>
            ))}
          {!techBars && <ErrorNotFound />}
        </div>
      </div>
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => {
  const techBars = state.techBarApp.schedulers;
  return {
    kapp: selectCurrentKapp(state),
    techBars,
    hasTechBarDisplayRole: true,
    // techBars &&
    // Utils.isMemberOf(
    //   state.app.profile,
    //   `Role::Tech Bar Display::${techBars[0].values['Name']}`,
    // ),
  };
};

export const DisplayMultiple = compose(connect(mapStateToProps))(
  DisplayMultipleComponent,
);
