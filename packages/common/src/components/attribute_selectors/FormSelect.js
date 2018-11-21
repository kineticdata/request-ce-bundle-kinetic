import React from 'react';
import {
  Menu,
  Token,
  Typeahead,
  Highlighter,
  MenuItem,
} from 'react-bootstrap-typeahead';
import { Map, List } from 'immutable';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import memoize from 'memoize-one';
import { CoreAPI } from 'react-kinetic-core';

import { Cache } from '../../cache';

export const FormMenuItem = props => {
  const disabledReason = props.disabledFn && props.disabledFn(props.option);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!!disabledReason}
    >
      <div className="kapp-menu-item">
        <div>
          <Highlighter search={props.text}>
            {props.kappSlug ? props.option.label : props.option.kappFormName}
          </Highlighter>
          <div>
            <small>{props.option.description}</small>
          </div>
        </div>
        {disabledReason && <small>{disabledReason}</small>}
      </div>
    </MenuItem>
  );
};

const renderMenu = memoize((disabledFn, kappSlug) => (results, props) => {
  return (
    <Menu {...props}>
      {results.map((option, i) => {
        return (
          <FormMenuItem
            key={i}
            option={option}
            position={i}
            text={props.text}
            disabledFn={disabledFn}
            kappSlug={kappSlug}
          />
        );
      })}
    </Menu>
  );
});

const renderToken = (option, props, index) => (
  <Token key={index} onRemove={props.onRemove} className="team">
    {option.label}
  </Token>
);

const formCache = new Cache(() =>
  CoreAPI.fetchSpace({
    include: 'kapps,kapps.attributesMap,kapps.forms,kapps.forms.attributesMap',
  }).then(({ space }) =>
    space.kapps.reduce((kappAcc, kapp) => {
      const forms = List(
        kapp.forms.map(form => ({
          label: form.name,
          name: form.name,
          slug: form.slug,
          description: form.description,
          kappFormSlug: `${kapp.slug} > ${form.slug}`,
          kappFormName: `${kapp.name} > ${form.name}`,
        })),
      );

      return kappAcc.set(
        kapp.slug,
        Map({
          label: kapp.name,
          name: kapp.name,
          slug: kapp.slug,
          forms: forms,
        }),
      );
    }, Map()),
  ),
);

const anyMatch = (array, source) => {
  return !!array.find(entry => entry === source);
};

const getSelected = (value, valueMapper, options) =>
  options.filter(option =>
    anyMatch(value, valueMapper ? valueMapper(option) : option),
  );

export class FormSelect extends React.Component {
  state = { options: null };

  static getDerivedStateFromProps(props) {
    return { renderMenu: renderMenu(props.disabledFn, props.kappSlug) };
  }

  componentDidMount() {
    formCache.get().then(kapps => {
      let options = [];
      if (this.props.kappSlug) {
        const forms = kapps.getIn([this.props.kappSlug, 'forms']);
        options = [...forms].sort((a, b) => a.label.localeCompare(b.label));
      } else {
        const forms = kapps
          .reduce((kappAcc, kapp) => [...kappAcc, kapp.get('forms')], List())
          .reduce((a, b) => [...a, ...b]);
        options = [...forms].sort((a, b) =>
          a.kappFormName.localeCompare(b.label),
        );
      }
      this.setState({ options });
    });
  }

  handleChange = value => {
    this.props.onChange({
      target: {
        id: this.props.id,
        value: this.props.valueMapper
          ? value.map(this.props.valueMapper)
          : value,
      },
    });
  };

  render() {
    return (
      this.state.options && (
        <div className="form-group">
          <label>{this.props.label}</label>
          <Typeahead
            className={this.props.className}
            kappSlug={this.props.kappSlug}
            multiple={this.props.multiple}
            options={this.state.options}
            renderMenu={this.state.renderMenu}
            renderToken={renderToken}
            selected={getSelected(
              this.props.value,
              this.props.valueMapper,
              this.state.options,
            )}
            onChange={this.handleChange}
            placeholder={this.props.placeholder || 'Select a Form'}
          />
          <small className="form-text text-muted">
            {this.props.description}
          </small>
        </div>
      )
    );
  }
}
