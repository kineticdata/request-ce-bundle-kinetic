export const isActiveClass = defaultClass => props => ({
  className: props.isCurrent ? `${defaultClass} active` : defaultClass,
});

export const refreshFilter = ({
  filter,
  fetchList,
  setOffsetWithScroll,
}) => () => {
  if (filter) {
    fetchList(filter);

    if (setOffsetWithScroll) {
      setOffsetWithScroll(0);
    }
  }
};
