import 'babel-core/register';
import 'babel-polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });

global.bundle = {
  apiLocation: () => '/acme/app/api/v1',
  spaceLocation: () => '/acme',
  kappSlug: () => 'queue',
};
