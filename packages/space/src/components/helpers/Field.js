import React from 'react';
import { Seq, Set } from 'immutable';

const INPUT_PROPS = Set([
  'name',
  'onBlur',
  'onChange',
  'onDragStart',
  'onDrop',
  'onFocus',
  'value',
]);

// Redux form passes in several props that are not valid for react 'input'
// elements. React has since started to print warnings about these props so the
// helper below is used to filter out props that react will complain about.
const filterProps = props =>
  Seq(props)
    .filter((value, key) => INPUT_PROPS.contains(key))
    .toJS();

export const Field = props => (
  <div>
    <input
      {...filterProps(props.controls)}
      type={props.type}
      value={props.controls.value || ''}
      disabled={props.disabled}
    />
  </div>
);
