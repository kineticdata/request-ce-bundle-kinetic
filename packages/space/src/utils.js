import md5 from 'md5';
import { Utils, Constants } from 'common';

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
