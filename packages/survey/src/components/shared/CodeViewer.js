import React, { Component, createRef } from 'react';
import { CodeInput } from '@kineticdata/react';
import { Tooltip } from 'reactstrap';
import classNames from 'classnames';

export class CodeViewer extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = createRef();
    this.state = {};
  }

  wrapCopy = copyFn => () => {
    clearTimeout(this.copyTimeout);
    copyFn();
    this.setState({ copied: true });
    this.copyTimeout = setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  };

  componentWillUnmount() {
    clearTimeout(this.copyTimeout);
  }

  render() {
    return (
      <CodeInput
        language={this.props.language}
        className="form-control"
        value={this.props.value}
        disabled
      >
        {({ copy, editor, wrapperProps }) => (
          <div {...wrapperProps} className="code-input">
            <div className="content">{editor}</div>
            <div className="toolbar">
              <button
                ref={this.buttonRef}
                type="button"
                className={classNames('btn btn-xs', {
                  copied: this.state.copied,
                })}
                onClick={this.wrapCopy(copy)}
              >
                {this.state.copied ? (
                  <span className="fa fa-fw fa-check" />
                ) : (
                  <span className="fa fa-fw fa-clipboard" />
                )}
              </button>
              <Tooltip
                isOpen={this.state.copied}
                target={this.buttonRef}
                placement="bottom"
              >
                Copied
              </Tooltip>
            </div>
          </div>
        )}
      </CodeInput>
    );
  }
}

CodeViewer.displayName = 'CodeViewer';
