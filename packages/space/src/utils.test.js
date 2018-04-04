import md5 from 'md5';
import { buildHierarchy } from './utils';

describe('helpers/utils.js', () => {
  describe('buildHierarchy', () => {
    test('When name is IT', () => {
      const name = 'IT';
      const heirarchy = {
        ancestors: [],
        localName: 'IT',
        name: 'IT',
        parent: null,
        slug: 'cd32106bcb6de321930cf34574ea388c',
      };
      expect(buildHierarchy(name)).toEqual(heirarchy);
    });
    test('When name is IT::Support', () => {
      const fullName = 'IT::Support';
      const heirarchy = {
        ancestors: [
          {
            ancestors: [],
            localName: 'IT',
            name: 'IT',
            parent: null,
            slug: 'cd32106bcb6de321930cf34574ea388c',
          },
        ],
        localName: 'Support',
        name: fullName,
        parent: {
          ancestors: [],
          localName: 'IT',
          name: 'IT',
          parent: null,
          slug: 'cd32106bcb6de321930cf34574ea388c',
        },
        slug: '7babc4dba0abae097fe59fbf7d4a95d6',
      };
      expect(buildHierarchy(fullName)).toEqual(heirarchy);
    });
  });
});
