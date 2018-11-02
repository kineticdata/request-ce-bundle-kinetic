import React from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';

export const HoverCard = props => {
  const {
    children,
    render,
    visible,
    position,
    handleEnter,
    handleLeave,
    hoverable,
    setWrapperRef,
  } = props;

  const wrapperProps = hoverable
    ? {
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        onTouchStart: handleEnter,
        onTouchEnd: handleLeave,
      }
    : {
        onClick: handleEnter,
      };

  return (
    <div {...wrapperProps} ref={setWrapperRef}>
      {children}
      {visible && (
        <div
          style={{
            top: position.y,
            left: position.x,
            position: 'absolute',
            zIndex: '999',
          }}
        >
          <div style={{ backgroundColor: '#fff' }}>{render()}</div>
        </div>
      )}
    </div>
  );
};

const handleEnter = ({ setVisible, setPosition }) => e => {
  // Sometimes the width on the event comes in as undefined. To guard against
  // really strange placement lets assume has some width. Most of the time this
  // is being used on an avatar or icon so we'll use 24px.
  setPosition({
    x: e.target.offsetLeft + (e.target.width || 24) + 12,
    y: e.target.offsetTop,
  });
  setVisible(true);
};

const handleLeave = ({ setVisible }) => () => setVisible(false);
const handleClickOutside = ({ setVisible, visible, getWrapperRef }) => e => {
  const wrapperRef = getWrapperRef();

  if (visible && wrapperRef && !wrapperRef.contains(e.target)) {
    setVisible(false);
  }
};

export const Hoverable = compose(
  withState('visible', 'setVisible', false),
  withState('position', 'setPosition', { x: 0, y: 0 }),
  withHandlers(() => {
    let wrapperRef;

    return {
      setWrapperRef: () => ref => (wrapperRef = ref),
      getWrapperRef: () => () => wrapperRef,
    };
  }),
  withHandlers({
    handleEnter,
    handleLeave,
    handleClickOutside,
  }),
  lifecycle({
    componentDidMount() {
      document.addEventListener('mousedown', this.props.handleClickOutside);
    },
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.props.handleClickOutside);
    },
  }),
)(HoverCard);
