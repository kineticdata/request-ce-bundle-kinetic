import React from 'react';
import { shallow } from 'enzyme';
import { List } from 'immutable';

import { Header, dropdownTitleName } from './Header';

describe('<Header />', () => {
  let isGuest;
  let hasSidebar;
  let toggleSidebarOpen;
  let alerts;
  let fetchAlerts;
  let profile;
  let openFeedbackForm;
  let openHelpForm;
  let openInviteOthersForm;
  let openKitchenSinkForm;
  let currentKapp;
  let predefinedKapps;
  let additionalKapps;

  beforeEach(() => {
    isGuest = false;
    hasSidebar = true;
    toggleSidebarOpen = jest.fn();
    alerts = List();
    fetchAlerts = jest.fn();
    profile = {};
    openFeedbackForm = jest.fn();
    openHelpForm = jest.fn();
    openInviteOthersForm = jest.fn();
    openKitchenSinkForm = jest.fn();
    currentKapp = { name: 'name' };
    predefinedKapps = [{ slug: 'preferred-slug', name: 'Preferred Name' }];
    additionalKapps = [];
  });

  const renderHeader = () => (
    <Header
      isGuest={isGuest}
      hasSidebar={hasSidebar}
      toggleSidebarOpen={toggleSidebarOpen}
      alerts={alerts}
      fetchAlerts={fetchAlerts}
      profile={profile}
      openFeedbackForm={openFeedbackForm}
      openHelpForm={openHelpForm}
      openInviteOthersForm={openInviteOthersForm}
      openKitchenSinkForm={openKitchenSinkForm}
      currentKapp={currentKapp}
      predefinedKapps={predefinedKapps}
      additionalKapps={additionalKapps}
    />
  );
  test('snapshot', () => {
    const wrapper = shallow(renderHeader());

    expect(wrapper).toMatchSnapshot();
  });

  describe('.hasSidebar', () => {
    test('exists when there is a #toggleSidebarOpen', () => {
      const wrapper = shallow(renderHeader()).dive();
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find('#header-sidebar-toggle')).toHaveLength(1);
    });

    test('does not exist when there is no #toggleSidebarOpen', () => {
      hasSidebar = false;
      toggleSidebarOpen = null;
      const wrapper = shallow(renderHeader()).dive();
      expect(wrapper.find('#header-sidebar-toggle')).toHaveLength(0);
    });
  });

  describe('.isGuest', () => {
    describe('when user is a guest', () => {
      test('does not render the kapp dropdown', () => {
        isGuest = true;

        const wrapper = shallow(renderHeader()).dive();
        expect(wrapper.find('#header-kapp-dropdown')).toHaveLength(0);
      });
    });

    describe('when user is not a guest', () => {
      test('renders the kapp dropdown', () => {
        const wrapper = shallow(renderHeader()).dive();
        expect(wrapper.find('#header-kapp-dropdown')).toHaveLength(1);
      });

      test('sets the dropdown name to "Home" when there is no current kapp', () => {
        expect(dropdownTitleName(null)).toBe('Home');
      });
    });
  });
});
