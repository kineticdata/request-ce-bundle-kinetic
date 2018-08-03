// https://github.com/raphasilvac/react-simple-contenteditable
// The MIT License (MIT)
//
// Copyright (c) 2018 Raphael Cavalcanti, contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React, { Component } from 'react';

export default class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);
  }

  _onChange(ev) {
    const method = this.getInnerMethod();
    const value = this.elem[method];

    this.props.onChange(ev, value);
  }

  _onPaste(ev) {
    const { onPaste, contentEditable } = this.props;

    if (contentEditable === 'plaintext-only') {
      var text = ev.clipboardData.getData('text');
      const commandExecuted = document.execCommand('insertText', false, text);
      // The command above does not work in IE11 so in that case we do not want
      // to prevent the default pasting, which fortunately seems to paste as
      // plaintext only anyways.
      if (commandExecuted) {
        ev.preventDefault();
      }
    }

    if (onPaste) {
      onPaste(ev);
    }
  }

  _onKeyPress(ev) {
    const method = this.getInnerMethod();
    const value = this.elem[method];

    this.props.onKeyPress(ev, value);
  }

  getInnerMethod() {
    return this.props.contentEditable === 'plaintext-only'
      ? 'innerText'
      : 'innerHTML';
  }

  shouldComponentUpdate(nextProps, nextState) {
    const method = this.getInnerMethod();
    return nextProps.html !== this.elem[method];
  }

  render() {
    const { tagName, html, contentEditable, ...props } = this.props;

    const Element = tagName || 'div';

    return (
      <Element
        {...props}
        ref={elem => {
          this.elem = elem;
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        contentEditable={contentEditable === 'false' ? false : true}
        onInput={this._onChange}
        onPaste={this._onPaste}
        onKeyPress={this._onKeyPress}
        // New key each render forces react to re-create this element, see the
        // stackoverflow issue for more details.
        // https://stackoverflow.com/questions/30242530/dangerouslysetinnerhtml-doesnt-update-during-render
        key={new Date()}
      />
    );
  }
}
