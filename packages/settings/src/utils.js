import md5 from 'md5';
import { Utils, Constants } from 'common';
import { Range } from 'immutable';

export const isActiveClass = defaultClass => props => ({
  className: props.isCurrent ? `${defaultClass} active` : defaultClass,
});

const COLORS = [
  Constants.COLORS.blue,
  Constants.COLORS.blueSky,
  Constants.COLORS.blueLake,
  Constants.COLORS.blueSlate,
  Constants.COLORS.green,
  Constants.COLORS.greenGrass,
  Constants.COLORS.greenTeal,
  Constants.COLORS.orange,
  Constants.COLORS.orangeKinops,
  Constants.COLORS.purple,
  Constants.COLORS.redPurple,
  Constants.COLORS.red,
  Constants.COLORS.redRose,
  Constants.COLORS.sunflower,
  Constants.COLORS.yellow,
];

export const getColor = string =>
  string ? COLORS[parseInt(md5(string), 16) % COLORS.length] : COLORS[5];

export const getTeamColor = team =>
  Utils.getAttributeValue(team, 'Color', getColor(team.slug));

export const getTeamIcon = team => {
  const iconAttribute = Utils.getAttributeValue(team, 'Icon', 'fa-users');
  return iconAttribute.indexOf('fa-') === 0
    ? iconAttribute.slice('fa-'.length)
    : iconAttribute;
};

export const buildHierarchy = name => {
  const segments = name.split('::');
  let parent = null;
  let ancestors = [];
  segments.forEach(segment => {
    const item = {
      localName: segment,
      name: parent ? `${parent.name}::${segment}` : segment,
      slug: md5(parent ? `${parent.name}::${segment}` : segment),
      parent,
      ancestors,
    };
    parent = item;
    ancestors = [...ancestors, item];
  });
  return parent;
};

export const isBlank = string => !string || string.trim().length === 0;

/**
 *  Take a large List and return a Sequence of List.  Will spilt List into equal chuncks.
 * Last chunk may be smaller if split can't be done evenly.
 *
 * @param {List} list - List of elements
 * @param {number} [chunkSize=1] - Desired size of chunks
 * @returns {List} - List of List elements
 */
export const chunkList = (list, chunkSize = 1) =>
  Range(0, list.count(), chunkSize)
    .map(chunkStart => list.slice(chunkStart, chunkStart + chunkSize))
    .toList();
