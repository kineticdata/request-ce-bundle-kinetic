import React from 'react';
import { CodeInput, I18n } from '@kineticdata/react';
import { UncontrolledTooltip } from 'reactstrap';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

const generateCodeField = templateMode => props => (
  <FieldWrapper {...props}>
    <I18n
      render={translate => (
        <CodeInput
          template={templateMode}
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          id={props.id}
          name={props.name}
          bindings={props.options}
          value={props.value}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          language={props.language}
          placeholder={translate(props.placeholder)}
          disabled={!props.enabled}
        >
          {({ wrapperProps, editor, startTypeahead }) => (
            <div {...wrapperProps} className="code-input">
              <div className="content">{editor}</div>
              <div className="toolbar">
                <button
                  id={`${props.id}-button`}
                  type="button"
                  className="btn btn-xs"
                  onClick={startTypeahead}
                >
                  <span className="fa fa-fw fa-code" />
                </button>
                <UncontrolledTooltip
                  placement="top"
                  target={`${props.id}-button`}
                >
                  {translate('Click here or type "$" to insert a variable')}
                </UncontrolledTooltip>
              </div>
            </div>
          )}
        </CodeInput>
      )}
    />
  </FieldWrapper>
);

export const CodeField = generateCodeField(false);
CodeField.displayName = 'CodeField';

export const CodeTemplateField = generateCodeField(true);
CodeTemplateField.displayName = 'CodeTemplateField';
