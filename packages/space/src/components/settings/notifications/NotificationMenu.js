import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { actions } from '../../../redux/modules/settingsNotifications';

const wrapVar = type => property => `\${${type}('${property}')}`;

const submissionProperties = [
  'handle',
  'id',
  'closedAt',
  'closedBy',
  'coreState',
  'createdAt',
  'createdBy',
  'label',
  'submittedAt',
  'submittedBy',
  'type',
  'updatedAt',
  'updatedBy',
];
const formProperties = [
  'Form Name',
  'Form Slug',
  'Form Description',
  'Form Status',
  'Form Notes',
  'Form Type',
];
const kappProperties = ['Kapp Name', 'Kapp Slug'];
const spaceProperties = ['Space Slug'];

const SubmissionMenu = ({ form, handleClick }) => (
  <ul className="dropdown-menu">
    {submissionProperties.map(wrapVar('submission')).map(prop => (
      <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
        {prop}
      </DropdownItem>
    ))}
    <div className="dropdown-divider" />
    <h6 className="dropdown-header">Submission Values</h6>
    {form ? (
      form.fields
        .map(field => field.name)
        .map(wrapVar('values'))
        .map(prop => (
          <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
            {prop}
          </DropdownItem>
        ))
    ) : (
      <Fragment>
        <small className="dropdown-header">
          Select a form to see available fields or select the placeholder below
          and manually enter the field name
        </small>
        <DropdownItem
          data-value={wrapVar('values')('###Field Name Here###')}
          onClick={handleClick}
        >
          {wrapVar('values')('###Field Name Here###')}
        </DropdownItem>
      </Fragment>
    )}
  </ul>
);

const FormMenu = ({ form, handleClick }) => (
  <ul className="dropdown-menu">
    {formProperties.map(wrapVar('form')).map(prop => (
      <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
        {prop}
      </DropdownItem>
    ))}
    <div className="dropdown-divider" />
    <h6 className="dropdown-header">Form Attributes</h6>
    {form ? (
      Object.keys(form.attributes)
        .map(wrapVar('formAttributes'))
        .map(prop => (
          <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
            {prop}
          </DropdownItem>
        ))
    ) : (
      <Fragment>
        <small className="dropdown-header">
          Select a form to see available attributes or select the placeholder
          below and manually enter the attribute name
        </small>
        <DropdownItem
          data-value={wrapVar('formAttributes')(
            '##Replace with form attribute name##',
          )}
          onClick={handleClick}
        >
          {wrapVar('formAttributes')('##Replace with form attribute name##')}
        </DropdownItem>
      </Fragment>
    )}
  </ul>
);

const KappMenu = ({ kapp, handleClick }) => (
  <ul className="dropdown-menu">
    {kappProperties.map(wrapVar('kapp')).map(prop => (
      <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
        {prop}
      </DropdownItem>
    ))}
    <div className="dropdown-divider" />
    <h6 className="dropdown-header">Kapp Attributes</h6>
    {kapp ? (
      kapp.attributes
        .map(attribute => attribute.name)
        .map(wrapVar('kappAttributes'))
        .map(prop => (
          <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
            {prop}
          </DropdownItem>
        ))
    ) : (
      <Fragment>
        <small className="dropdown-header">
          Select a kapp to see available attributes or select the placeholder
          below and manually enter the attribute name
        </small>
        <DropdownItem
          data-value={wrapVar('kappAttributes')(
            '##Replace with attribute name##',
          )}
          onClick={handleClick}
        >
          {wrapVar('kappAttributes')('##Replace with attribute name##')}
        </DropdownItem>
      </Fragment>
    )}
  </ul>
);

const SpaceMenu = ({ space, handleClick }) => (
  <ul className="dropdown-menu">
    {spaceProperties.map(wrapVar('space')).map(prop => (
      <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
        {prop}
      </DropdownItem>
    ))}
    <div className="dropdown-divider" />
    <h6 className="dropdown-header">Space Attributes</h6>
    {space.attributes
      .map(attribute => attribute.name)
      .map(wrapVar('spaceAttributes'))
      .map(prop => (
        <DropdownItem key={prop} data-value={prop} onClick={handleClick}>
          {prop}
        </DropdownItem>
      ))}
  </ul>
);

const OtherVariablesMenu = ({ handleClick }) => (
  <ul className="dropdown-menu">
    <small className="dropdown-header">
      Provided at run-time in the Task engine. Select the placeholder below and
      manually enter the variable name
    </small>
    <DropdownItem
      data-value={wrapVar('vars')('##Replace with variable name##')}
      onClick={handleClick}
    >
      {wrapVar('vars')('##Replace with variable name##')}
    </DropdownItem>
  </ul>
);

const DateFormatMenu = ({ dateFormats, selection, handleClick }) => (
  <ul className="dropdown-menu">
    {selection && selection.startsWith('${') && selection.endsWith('}') ? (
      <Fragment>
        <small className="dropdown-header">
          Formatting selection: {selection}
        </small>
        {dateFormats.map(name => (
          <DropdownItem
            key={name}
            data-value={wrapVar('appearance')(
              selection + wrapVar('format')(name),
            )}
            onClick={handleClick}
          >
            {name}
          </DropdownItem>
        ))}
      </Fragment>
    ) : (
      <small className="dropdown-header">
        Highlight a dynamic replacement value in one of the fields below that
        you would like to apply a date format to.
      </small>
    )}
  </ul>
);

const SnippetsMenu = ({ snippets, handleClick }) => (
  <ul className="dropdown-menu">
    {snippets.map(snippet => (
      <DropdownItem
        key={snippet.values.Name}
        data-value={wrapVar('snippet')(snippet.values.Name)}
        onClick={handleClick}
      >
        {wrapVar('snippet')(snippet.values.Name)}
      </DropdownItem>
    ))}
  </ul>
);

export const NotificationMenuComponent = ({
  selection,
  space,
  kapps,
  forms,
  snippets,
  dateFormats,
  selectedKapp,
  selectedForm,
  handleClick,
  handleKappSelect,
  handleFormSelect,
}) => (
  <div className="alert alert-secondary">
    <h2>Dynamic Replacements</h2>
    <p>
      Use the dropdown to insert dynamic elements within the subject and body of
      your templates. Just put your cursor into one of those fields where you
      want the element to appear and choose an option from the dropdown list.
    </p>
    <p>
      Selecting a Kapp and Form will populate the dropdown menu with available
      options.
    </p>
    <p>
      Caution: Email templates can be used by any process. Since not all Kapps
      have the same attributes and not all forms have the same attributes or
      fields, relying on attributes or fields that may not exist will yield
      unexpected results. Test your email templates!
    </p>
    <div className="form-row">
      <div className="form-group col-md-2">
        <label htmlFor="notification-menu-kapp">Kapp</label>
        <select
          id="notification-menu-kapp"
          className="form-control"
          value={selectedKapp ? selectedKapp.slug : ''}
          onChange={handleKappSelect}
        >
          <option />
          {kapps.map(kapp => (
            <option key={kapp.slug} value={kapp.slug}>
              {kapp.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="notification-menu-form">Form</label>
        <select
          id="notification-menu-form"
          className="form-control"
          value={selectedForm ? selectedForm.slug : ''}
          onChange={handleFormSelect}
        >
          {forms ? (
            <Fragment>
              <option />
              {forms.map(form => (
                <option key={form.slug} value={form.slug}>
                  {form.name}
                </option>
              ))}
            </Fragment>
          ) : (
            <option value="" disabled>
              Select a Kapp first
            </option>
          )}
        </select>
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="">Dynamic Replacement Value</label>
        <UncontrolledButtonDropdown>
          <DropdownToggle caret>
            Insert Dynamic Replacement Value
          </DropdownToggle>
          <DropdownMenu className="dropdown-multi">
            <li className="dropdown-item dropdown-submenu">
              Snippets
              <SnippetsMenu snippets={snippets} handleClick={handleClick} />
            </li>
            <li className="dropdown-item dropdown-submenu">
              Submission
              <SubmissionMenu form={selectedForm} handleClick={handleClick} />
            </li>
            <li className="dropdown-item dropdown-submenu">
              Form
              <FormMenu form={selectedForm} handleClick={handleClick} />
            </li>
            <li className="dropdown-item dropdown-submenu">
              Kapp
              <KappMenu kapp={selectedKapp} handleClick={handleClick} />
            </li>
            <li className="dropdown-item dropdown-submenu">
              Space
              <SpaceMenu space={space} handleClick={handleClick} />
            </li>
            <li className="dropdown-item dropdown-submenu">
              Other variables
              <OtherVariablesMenu handleClick={handleClick} />
            </li>
            <li className="dropdown-item dropdown-submenu">
              Date Formats
              <DateFormatMenu
                handleClick={handleClick}
                selection={selection}
                dateFormats={dateFormats}
              />
            </li>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  space: state.app.space,
  kapps: state.app.kapps,
  forms:
    state.space.settingsNotifications.variables &&
    state.space.settingsNotifications.variables.forms,
  dateFormats: state.space.settingsNotifications.dateFormats
    .filter(submission => submission.values.Status === 'Active')
    .map(submission => submission.values.Name),
  snippets: state.space.settingsNotifications.notificationSnippets.filter(
    submission => submission.values.Status === 'Active',
  ),
});

const mapDispatchToProps = {
  fetchVariables: actions.fetchVariables,
  fetchNotifications: actions.fetchNotifications,
  fetchDateFormats: actions.fetchDateFormats,
};

export const NotificationMenu = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('selectedKapp', 'setSelectedKapp', null),
  withState('selectedForm', 'setSelectedForm', null),
  withHandlers({
    handleClick: props => event => props.onSelect(event.target.dataset.value),
    handleKappSelect: props => event => {
      props.fetchVariables(event.target.value);
      props.setSelectedKapp(
        props.kapps.find(kapp => kapp.slug === event.target.value),
      );
    },
    handleFormSelect: props => event => {
      props.setSelectedForm(
        props.forms.find(form => form.slug === event.target.value),
      );
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchNotifications();
      this.props.fetchDateFormats();
    },
  }),
)(NotificationMenuComponent);
