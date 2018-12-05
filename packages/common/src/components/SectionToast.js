import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

export class SectionToast extends Component {
  state = { in: false };

  componentDidMount() {
    this.setState({ in: true });
    this.timeout = setTimeout(
      () => this.setState({ in: false }),
      this.props.duration || 2000,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <CSSTransition
        in={this.state.in}
        timeout={300}
        unmountOnExit
        classNames="section-toast"
      >
        <div className="section-toast toast toast--success toast--large">
          <div className="toast__wrapper">
            <div className="toast__title">
              {this.props.children}
              <div className="toast__actions">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => this.setState({ in: false })}
                >
                  <i className="fa fa-lg fa-fw fa-times" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}
