import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withProps, withState } from 'recompose';
import {
  KappLink as Link,
  PageTitle,
  selectCurrentKapp,
  Constants,
  Utils,
} from 'common';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import {
  SESSION_ITEM_USER_LOCATION,
  SESSION_ITEM_CURRENT_TECH_BAR,
  mapTechBarsForDistance,
  sortTechBarsByDistance,
} from '../redux/modules/techBarApp';
import { I18n } from '../../../app/src/I18nProvider';

export const TechBarsComponent = ({
  kapp,
  techBars,
  openDropdown,
  toggleDropdown,
  hasTechBarDisplayRole,
  currentTechBar,
  selectCurrentTechBar,
}) => (
  <Fragment>
    <PageTitle parts={['Tech Bars']} />
    <div className="page-container page-container--tech-bar container">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">
              <I18n>tech bar</I18n>
            </Link>{' '}
            /{' '}
          </h3>
          <h1>
            <I18n>All Tech Bars</I18n>
          </h1>
        </div>
      </div>
      <section>
        <div className="cards__wrapper cards__wrapper--tech-bar">
          {techBars.map(techBar => (
            <div
              className="card card--tech-bar-loc"
              key={techBar.id}
              style={
                currentTechBar && techBar.id === currentTechBar.id
                  ? { borderTopColor: Constants.COLORS.sunflower }
                  : undefined
              }
            >
              <div className="card-body">
                <span className="icon fa fa-map-marker" />
                <div className="content">
                  <span className="title">
                    <I18n>{techBar.values['Name']}</I18n>
                  </span>
                  {techBar.values['Location'] && (
                    <div className="subtitle">
                      <I18n>{techBar.values['Location']}</I18n>
                    </div>
                  )}
                  <div className="details">
                    {techBar.values['Description'] && (
                      <p>
                        <I18n>{techBar.values['Description']}</I18n>
                      </p>
                    )}
                    {techBar.values['Details'] && (
                      <p>
                        <I18n>{techBar.values['Details']}</I18n>
                      </p>
                    )}
                  </div>
                </div>
                {hasTechBarDisplayRole(techBar.values['Name']) && (
                  <span>
                    <Dropdown
                      toggle={toggleDropdown(techBar.id)}
                      isOpen={openDropdown === techBar.id}
                    >
                      <DropdownToggle color="link" className="btn-sm">
                        <span className="fa fa-ellipsis-v fa-2x" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <Link
                          to={`/display/${techBar.values['Id']}/checkin`}
                          className="dropdown-item"
                          target="_blank"
                        >
                          <span className="fa fa-fw fa-external-link mr-2" />
                          <span>
                            <I18n>Check In</I18n>
                          </span>
                        </Link>
                        <Link
                          to={`/display/${techBar.values['Id']}/feedback`}
                          className="dropdown-item"
                          target="_blank"
                        >
                          <span className="fa fa-external-link fa-fw mr-2" />
                          <span>
                            <I18n>Feedback</I18n>
                          </span>
                        </Link>
                        <Link
                          to={`/display/${
                            techBar.values['Id']
                          }/checkin?crosslink`}
                          className="dropdown-item"
                          target="_blank"
                        >
                          <span className="fa fa-external-link fa-fw mr-2" />
                          <span>
                            <I18n>Check In</I18n> / <I18n>Feedback</I18n>
                          </span>
                        </Link>
                        <Link
                          to={`/display/${techBar.values['Id']}/overhead`}
                          className="dropdown-item"
                          target="_blank"
                        >
                          <span className="fa fa-external-link fa-fw mr-2" />
                          <span>
                            <I18n>Overhead</I18n>
                          </span>
                        </Link>
                      </DropdownMenu>
                    </Dropdown>
                  </span>
                )}
              </div>
              <Link
                to={`/appointment/${techBar.values['Id']}`}
                className="btn btn-primary card-button"
              >
                <I18n>Schedule Now</I18n> →
              </Link>
              {techBars.size > 1 && (
                <div className="card-actions">
                  {currentTechBar && techBar.id === currentTechBar.id ? (
                    <button className="btn btn-sm btn-success" disabled>
                      <I18n>Current Tech Bar</I18n>
                    </button>
                  ) : (
                    <button
                      className="btn btn-link btn-sm"
                      onClick={() => selectCurrentTechBar(techBar.id)}
                    >
                      <I18n>Set as Current Tech Bar</I18n>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
  techBars: state.techBar.techBarApp.schedulers
    .filter(s => s.values['Status'] === 'Active')
    .map(
      props.userLocation ? mapTechBarsForDistance(props.userLocation) : t => t,
    )
    .sort(props.userLocation ? sortTechBarsByDistance : () => 0),
  profile: state.app.profile,
});

export const mapDispatchToProps = {
  push,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? false : dropdownSlug);

const hasTechBarDisplayRole = ({ profile }) => techBarName =>
  Utils.isMemberOf(profile, `Role::Tech Bar Display::${techBarName}`);

const selectCurrentTechBar = ({ techBars, setCurrentTechBar }) => id => {
  sessionStorage.setItem(SESSION_ITEM_CURRENT_TECH_BAR, id);
  setCurrentTechBar(techBars.find(t => t.id === id));
};

export const TechBars = compose(
  withState('userLocation', 'setUserLocation', () => {
    try {
      const locObj = JSON.parse(
        sessionStorage.getItem(SESSION_ITEM_USER_LOCATION),
      );
      if (locObj && locObj.latitude != null && locObj.longitude != null) {
        return locObj;
      }
    } catch (e) {}
    return null;
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('currentTechBar', 'setCurrentTechBar', ({ techBars }) => {
    const techBarId = sessionStorage.getItem(SESSION_ITEM_CURRENT_TECH_BAR);
    return techBarId ? techBars.find(t => t.id === techBarId) : null;
  }),
  withState('openDropdown', 'setOpenDropdown', false),
  withHandlers({ toggleDropdown, hasTechBarDisplayRole, selectCurrentTechBar }),
)(TechBarsComponent);
