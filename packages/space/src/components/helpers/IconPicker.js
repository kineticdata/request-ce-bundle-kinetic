import React, { Component } from 'react';

export class IconPicker extends Component {
  componentDidMount() {
    // If jQuery is loaded as a global and the iconpicker plugin is available
    if (window.jQuery && window.jQuery.iconpicker) {
      // Decorate the icon picker input
      window
        .jQuery(this.input)
        .iconpicker({
          defaultValue: 'fa-group',
          hideOnSelect: true,
          placement: 'bottomLeft',
        })
        .on('iconpickerShown', this.props.controls.onFocus)
        .on('iconpickerHidden', this.props.controls.onBlur)
        .on('iconpickerSelect', this.props.controls.onChange);
    }
  }

  render() {
    return window.jQuery && window.jQuery.iconpicker ? (
      <div className="input-group iconpicker-container">
        <span className="input-group-addon" />
        <input
          name={this.props.controls.name}
          value={this.props.controls.value}
          defaultValue={this.props.controls.defaultValue}
          id={this.props.id}
          onBlur={this.props.controls.onBlur}
          onChange={this.props.controls.onChange}
          onFocus={this.props.controls.onFocus}
          className="form-control icp icp-auto iconpicker-element iconpicker-input"
          type="text"
          ref={input => {
            this.input = input;
          }}
        />
      </div>
    ) : (
      <input
        name={this.props.controls.name}
        value={this.props.controls.value}
        defaultValue={this.props.controls.defaultValue}
        id={this.props.id}
        onBlur={this.props.controls.onBlur}
        onChange={this.props.controls.onChange}
        onFocus={this.props.controls.onFocus}
        className="form-control icp icp-auto iconpicker-element iconpicker-input"
        type="text"
        ref={input => {
          this.input = input;
        }}
      />
    );
  }
}
