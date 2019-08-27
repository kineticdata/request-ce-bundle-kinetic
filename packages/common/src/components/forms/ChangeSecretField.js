import React from 'react';

export const ChangeSecretField = props =>
  props.visible && (
    <button
      type="button"
      className={`btn btn-sm ${props.value ? 'btn-danger' : 'btn-secondary'}`}
      onClick={() => props.onChange({ target: { checked: !props.value } })}
    >
      {props.value ? 'Cancel' : 'Modify'}
    </button>
  );
