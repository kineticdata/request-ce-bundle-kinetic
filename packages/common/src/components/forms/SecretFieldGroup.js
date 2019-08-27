import React from 'react';

export const SecretFieldGroup = ({ secretField, changeSecretField }) => (
  <div className="form-row">
    <div className="col">
      <fieldset>
        <legend className="sr-only">Screen Reader Only Legend</legend>
        <div className="form-row justify-content-between">
          <div className="col-auto">{secretField}</div>
          <div className="col-auto ml-auto align-self-end ">
            {changeSecretField}
          </div>
        </div>
      </fieldset>
    </div>
  </div>
);
