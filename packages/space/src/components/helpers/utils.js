import md5 from 'md5';

// const hierarchy = buildHierarchy("Foo::Bar::Baz");
//
// hierarchy.localName === 'Baz';
// hierarchy.name === 'Foo::Bar::Baz';
// hierarchy.slug === md5('Foo::Bar::Baz');
//
// hierarchy.parent.localName === 'Bar';
// hierarchy.parent.name === 'Foo::Bar';
// hierarchy.parent.slug === md5('Foo::Bar');
//
// hierarchy.ancestors[0].localName === 'Foo';
// hierarchy.ancestors[0].name === 'Foo';
// hierarchy.ancestors[0].slug === md5('Foo');
//
// hierarchy.ancestors[1].localName === 'Bar';
// hierarchy.ancestors[1].name === 'Foo::Bar';
// hierarchy.ancestors[1].slug === md5('Foo::Bar');

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
