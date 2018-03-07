import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Home } from './Home';

describe('<Home />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Home />);
  });

  test('verify snapshot', () => {
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should render a div containing a greeting', () => {
    const div = component.find('div').first();

    expect(div).toBeDefined();
    expect(div.text()).toEqual(expect.stringContaining('Hello'));
  });
});
