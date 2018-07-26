import React from 'react';
import { compose, withHandlers, withState } from 'recompose';

export const HoverCard = ({
  children,
  render,
  visible,
  position,
  handleEnter,
  handleLeave,
}) => (
  <div
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
    onTouchStart={handleEnter}
    onTouchEnd={handleLeave}
  >
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

export const Hoverable = compose(
  withState('visible', 'setVisible', false),
  withState('position', 'setPosition', { x: 0, y: 0 }),
  withHandlers({
    handleEnter,
    handleLeave,
  }),
)(HoverCard);
