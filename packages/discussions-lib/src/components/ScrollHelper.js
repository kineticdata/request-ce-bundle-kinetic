import React from 'react';

const ScrollPositions = {
  BOTTOM: 'bottom',
  MIDDLE: 'middle',
  TOP: 'top',
};

export class ScrollHelper extends React.Component {
  constructor(props) {
    super(props);
    this.position = ScrollPositions.BOTTOM;
  }

  handleScroll = ({ target: { scrollTop } }) => {
    let nextPosition = null;
    if (scrollTop === this.helper.scrollHeight - this.helper.clientHeight) {
      nextPosition = ScrollPositions.BOTTOM;
    } else if (scrollTop === 0) {
      nextPosition = ScrollPositions.TOP;
    } else {
      nextPosition = ScrollPositions.MIDDLE;
    }
    if (
      typeof this.props.onScrollTo === 'function' &&
      !(
        nextPosition === ScrollPositions.MIDDLE &&
        this.position === ScrollPositions.MIDDLE
      )
    ) {
      this.props.onScrollTo(nextPosition);
    }
    this.position = nextPosition;
  };

  adjustScrollTop = () => {
    if (this.position === ScrollPositions.BOTTOM) {
      this.scrollToBottom();
    } else if (this.position === ScrollPositions.TOP) {
      this.helper.scrollTop = Math.max(
        0,
        this.helper.scrollHeight - this.lastScrollHeight,
      );
    }
    this.lastScrollHeight = this.helper.scrollHeight;
  };

  componentDidMount = () => this.adjustScrollTop();

  componentDidUpdate = () => this.adjustScrollTop();

  scrollToBottom = () => {
    this.helper.scrollTop = this.helper.scrollHeight - this.helper.clientHeight;
  };

  render = () => (
    <div
      ref={el => (this.helper = el)}
      onScroll={this.handleScroll}
      className="message-wrapper"
    >
      {this.props.children}
    </div>
  );
}
