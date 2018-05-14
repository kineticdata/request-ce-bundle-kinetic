import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { Map, Seq } from 'immutable';
import { push } from 'connected-react-router';
import { commonActions } from 'common';
import { actions } from '../../../redux/modules/settingsNotifications';
import { NotificationMenu } from './NotificationMenu';

const fields = ['Name', 'Status', 'Subject', 'HTML Content', 'Text Content'];

const NotificationComponent = ({
  loading,
  submission,
  type,
  dirty,
  values,
  selection,
  handleFieldChange,
  handleFieldBlur,
  handleSubmit,
  handleVariableSelection,
}) => (
  <div className="page-container page-container--notifications">
    <div className="page-panel page-panel--scrollable">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to={`/settings/notifications/${type}`}>
              notification {type}
            </Link>
            {` `}
            /
          </h3>
          {!loading && (
            <h1>
              {submission
                ? submission.label
                : `New ${type === 'templates' ? 'Template' : 'Snippet'}`}
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
              <label htmlFor="name">Name</label>
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
              <label className="field-label">Status</label>
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

            <div className="form-group required">
              <label htmlFor="subject">Subject</label>
              <textarea
                id="subject"
                name="Subject"
                rows="2"
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                value={values.get('Subject')}
              />
            </div>
            <div className="form-group required">
              <label htmlFor="htmlContent">HTML Content</label>
              <textarea
                id="htmlContent"
                name="HTML Content"
                rows="8"
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                value={values.get('HTML Content')}
              />
            </div>
            <div className="form-group required">
              <label htmlFor="textContent">Text Content</label>
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
              <div className="form_footer__right">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!dirty || values.valueSeq().some(val => !val)}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
    </div>
  </div>
);

export const handleSubmit = props => event => {
  event.preventDefault();
  props.saveNotification(
    props.values.toJS(),
    props.submission && props.submission.id,
    submission => {
      const item = props.type === 'templates' ? 'Template' : 'Snippet';
      const action = props.submission ? 'Updated' : 'Created';
      props.push(`/settings/notifications/${props.type}`);
      props.addSuccess(
        `Successfully ${action.toLowerCase()} ${item.toLowerCase()} (${
          submission.handle
        })`,
        `${action} ${item}`,
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
  type: props.match.params.type,
  loading: state.settingsNotifications.notificationLoading,
  saving: state.settingsNotifications.saving,
});

export const mapDispatchToProps = {
  fetchNotification: actions.fetchNotification,
  resetNotification: actions.resetNotification,
  saveNotification: actions.saveNotification,
  fetchVariables: actions.fetchVariables,
  addSuccess: commonActions.addSuccess,
  push,
};

export const Notification = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('dirty', 'setDirty', false),
  withState('values', 'setValues', Map(fields.map(field => [field, '']))),
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
      this.props.fetchNotification(this.props.match.params.id);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.id !== nextProps.match.params.id) {
        this.props.fetchNotification(nextProps.match.params.id);
      }
      if (this.props.submission !== nextProps.submission) {
        this.props.setValues(
          fields.reduce(
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
