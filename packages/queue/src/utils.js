export const isActiveClass = defaultClass => props => ({
  className: props.isCurrent ? `${defaultClass} active` : defaultClass,
});
