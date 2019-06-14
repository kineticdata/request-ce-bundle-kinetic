import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { Link } from '@reach/router';
import { Map, Seq } from 'immutable';
import { push } from 'redux-first-history';
import { addSuccess } from 'common';
import { PageTitle } from '../shared/PageTitle';

import { actions } from '../../redux/modules/settingsNotifications';
import { context } from '../../redux/store';

import { I18n } from '@kineticdata/react';
import { NotificationMenu } from './NotificationMenu';

const fields = {
  Name: {
    required: true,
  },
  Status: {
    required: true,
  },
  Subject: {
    required: values => values.get('Type') === 'Template',
    visible: values => values.get('Type') === 'Template',
  },
  'HTML Content': {
    required: true,
  },
  'Text Content': {
    required: values => values.get('Type') === 'Template',
  },
  Type: {
    required: true,
  },
};

const evaluate = (condition, values) =>
  typeof condition === 'boolean'
    ? condition
    : typeof condition === 'function'
      ? condition(values)
      : false;

const isRequired = (name, values) => evaluate(fields[name].required, values);

const isVisible = (name, values) => evaluate(fields[name].visible, values);

const isValid = values =>
  !Object.entries(fields).some(
    ([name, _]) => isRequired(name, values) && !values.get(name),
  );

const NotificationComponent = ({
  loading,
  submission,
  type,
  title,
  dirty,
  values,
  selection,
  handleFieldChange,
  handleFieldBlur,
  handleSubmit,
  handleVariableSelection,
}) => (
  <div className="page-container page-container--panels page-container--notifications">
    <PageTitle
      parts={[
        submission ? submission.label : `New ${title}`,
        'Notifications',
        'Settings',
      ]}
    />
    <div className="page-panel page-panel--two-thirds page-panel--scrollable">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/settings">
              <I18n>settings</I18n>
            </Link>{' '}
            /{` `}
            <Link to={`/settings/notifications/${type}`}>
              <I18n>notification {type}</I18n>
            </Link>
            {` `}/
          </h3>
          {!loading && (
            <h1>
              {submission ? submission.label : <I18n>{`New ${title}`}</I18n>}
            </h1>
          )}
        </div>
      </div>
      {!loading &&
        values && (
          <form onSubmit={handleSubmit}>
            <Fragment>
              <NotificationMenu
                selection={selection}
                onSelect={handleVariableSelection}
              />
            </Fragment>
            <div className="form-group required">
              <label className="field-label" htmlFor="name">
                <I18n>Name</I18n>
              </label>
              <input
                type="text"
                id="name"
                name="Name"
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                value={values.get('Name')}
              />
            </div>

            <div className="radio required">
              <label className="field-label">
                <I18n>Status</I18n>
              </label>
              <label>
                <input
                  type="radio"
                  name="Status"
                  value="Active"
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  checked={values.get('Status') === 'Active'}
                />
                Active
              </label>
              <label>
                <input
                  type="radio"
                  name="Status"
                  value="Inactive"
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  checked={values.get('Status') === 'Inactive'}
                />
                Inactive
              </label>
            </div>
            {isVisible('Subject', values) && (
              <div className="form-group required">
                <label className="field-label" htmlFor="subject">
                  <I18n>Subject</I18n>
                </label>
                <textarea
                  id="subject"
                  name="Subject"
                  rows="2"
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  value={values.get('Subject')}
                />
              </div>
            )}
            <div className="form-group required">
              <label className="field-label" htmlFor="htmlContent">
                <I18n>HTML Content</I18n>
              </label>
              <textarea
                id="htmlContent"
                name="HTML Content"
                rows="8"
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                value={values.get('HTML Content')}
              />
            </div>
            <div
              className={`form-group ${
                isRequired('Text Content', values) ? 'required' : ''
              }`}
            >
              <label className="field-label" htmlFor="textContent">
                <I18n>Text Content</I18n>
              </label>
              <textarea
                id="textContent"
                name="Text Content"
                rows="8"
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                value={values.get('Text Content')}
              />
            </div>
            <div className="form__footer">
              <div className="form__footer__right">
                <Link
                  to="/settings/notifications"
                  className="btn btn-link mb-0"
                >
                  <I18n>Cancel</I18n>
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!dirty || !isValid(values)}
                >
                  {submission ? (
                    <I18n>Save Changes</I18n>
                  ) : (
                    <I18n>{`Create ${title}`}</I18n>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
    </div>
    <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--settings-sidebar">
      <h3>
        <I18n>Dynamic Replacements</I18n>
      </h3>
      <p>
        <I18n>
          Use the dropdown to insert dynamic elements within the subject and
          body of your templates. Just put your cursor into one of those fields
          where you want the element to appear and choose an option from the
          dropdown list.
        </I18n>
      </p>
      <p>
        <I18n>
          Selecting a Kapp and Form will populate the dropdown menu with
          available options.
        </I18n>
      </p>
      <p>
        <I18n>
          Caution: Email templates can be used by any process. Since not all
          Kapps have the same attributes and not all forms have the same
          attributes or fields, relying on attributes or fields that may not
          exist will yield unexpected results. Test your email templates!
        </I18n>
      </p>
    </div>
  </div>
);

export const handleSubmit = props => event => {
  event.preventDefault();
  props.saveNotification(
    props.values.toJS(),
    props.submission && props.submission.id,
    submission => {
      const action = props.submission ? 'Updated' : 'Created';
      props.push(`/settings/notifications/${props.type}`);
      addSuccess(
        `Successfully ${action.toLowerCase()} ${props.title.toLowerCase()} (${
          submission.handle
        })`,
        `${action} ${props.title}`,
      );
    },
  );
};

export const handleFieldChange = props => event => {
  props.setDirty(true);
  props.setValues(props.values.set(event.target.name, event.target.value));
};

export const handleFieldBlur = props => event => {
  const { name, selectionStart: start, selectionEnd: end } = event.target;
  if (['Subject', 'HTML Content', 'Text Content'].includes(name)) {
    props.setCursorPosition({ name, start, end });
    props.setSelection(props.values.get(name).substring(start, end));
  } else {
    props.setCursorPosition(null);
    props.setSelection(null);
  }
};

export const handleVariableSelection = props => variable => {
  if (props.cursorPosition) {
    const { name, start, end } = props.cursorPosition;
    const value = props.values.get(name);
    const newValue = Seq(value || [])
      .take(start)
      .concat(Seq(variable))
      .concat(Seq(value || []).skip(end))
      .join('');
    props.setValues(props.values.set(name, newValue));
  }
};

export const mapStateToProps = (state, props) => ({
  submission: state.settingsNotifications.notification,
  type: props.type,
  title: props.type === 'templates' ? 'Template' : 'Snippet',
  loading: state.settingsNotifications.notificationLoading,
  saving: state.settingsNotifications.saving,
});

export const mapDispatchToProps = {
  fetchNotification: actions.fetchNotification,
  resetNotification: actions.resetNotification,
  saveNotification: actions.saveNotification,
  fetchVariables: actions.fetchVariables,
  push,
};

export const Notification = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('dirty', 'setDirty', false),
  withState('values', 'setValues', props =>
    Map(Object.keys(fields).map(field => [field, ''])).set('Type', props.title),
  ),
  withState('cursorPosition', 'setCursorPosition', null),
  withState('selection', 'setSelection', null),
  withHandlers({
    handleSubmit,
    handleFieldChange,
    handleFieldBlur,
    handleVariableSelection,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchNotification(this.props.id);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.id !== nextProps.id) {
        this.props.fetchNotification(nextProps.id);
      }
      if (this.props.submission !== nextProps.submission) {
        this.props.setValues(
          Object.keys(fields).reduce(
            (values, field) =>
              values.set(field, nextProps.submission.values[field] || ''),
            Map(),
          ),
        );
        this.props.setDirty(false);
      }
    },
    componentWillUnmount() {
      this.props.resetNotification();
    },
  }),
)(NotificationComponent);
