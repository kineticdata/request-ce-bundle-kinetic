import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import {
  I18n,
  FormForm,
  SubmissionSearch,
  searchSubmissions,
} from '@kineticdata/react';
import { compose, withHandlers } from 'recompose';
import { connect } from '../../../redux/store';
import { FormComponents, LoadingMessage, addToast } from 'common';
import {
  actions,
  buildFormConfigurationObject,
} from '../../../redux/modules/settingsForms';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PageTitle } from '../../shared/PageTitle';

export const FieldsTableField = props => (
  <table className="table table-hover table--settings table-draggable">
    <thead>
      <tr className="header">
        <th scope="col">
          <I18n>Field</I18n>
        </th>
        <th scope="col">
          <I18n>Visible in Table</I18n>
        </th>
      </tr>
    </thead>
    {props.value && (
      <DragDropContext
        onDragEnd={({ source, destination }) =>
          destination &&
          source.index !== destination.index &&
          props.onChange(
            props.value.update(cols => {
              const col = cols.get(source.index);
              return cols.delete(source.index).insert(destination.index, col);
            }),
          )
        }
      >
        <Droppable droppableId="columns">
          {provided => (
            <tbody ref={provided.innerRef}>
              {props.value.map((col, index) => (
                <Draggable key={col.name} draggableId={col.name} index={index}>
                  {(provided, snapshot) => (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <td>
                        {col.type === 'value' ? (
                          <I18n>{col.label}</I18n>
                        ) : (
                          <i>
                            <I18n>{col.label}</I18n>{' '}
                            <small>
                              <I18n>(system field)</I18n>
                            </small>
                          </i>
                        )}
                      </td>
                      <td>
                        <input
                          onChange={e =>
                            props.onChange(
                              props.value.setIn(
                                [index, 'visible'],
                                e.target.checked,
                              ),
                            )
                          }
                          type="checkbox"
                          checked={col.visible}
                        />
                      </td>
                    </tr>
                  )}
                </Draggable>
              ))}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    )}
    {props.helpText && (
      <tfoot>
        <tr>
          <td colSpan="2">
            <small>{props.helpText}</small>
          </td>
        </tr>
      </tfoot>
    )}
  </table>
);

const fieldSet = [
  'description',
  'type',
  'status',
  'submissionTableFields',
  'permittedSubtasks',
  'prohibitSubtasks',
  'owningTeam',
  'allowReassignment',
  'assignableTeams',
  'notificationComplete',
  'notificationCreate',
];

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <br />
      <I18n>General Settings</I18n>
    </h2>
    {fields.get('description')}
    <div className="form-group__columns">
      {fields.get('type')}
      {fields.get('status')}
    </div>
    <br />
    <h2 className="section__title">
      <br />
      <I18n>Table Display Settings</I18n>
    </h2>
    {fields.get('submissionTableFields')}
    <br />
    <h2 className="section__title">
      <br />
      <I18n>Attributes</I18n>
    </h2>
    {/* {fields.get('attributesMap')} */}
    {fields.get('permittedSubtasks')}
    {fields.get('prohibitSubtasks')}
    {fields.get('owningTeam')}
    {fields.get('allowReassignment')}
    {fields.get('assignableTeams')}
    {fields.get('notificationCreate')}
    {fields.get('notificationComplete')}
    {error}
    {buttons}
  </Fragment>
);

const asArray = value => (value ? [value] : []);

const notificationSearch = new SubmissionSearch(true)
  .index('values[Name]')
  .includes(['values'])
  .limit(1000)
  .build();

export const FormSettingsComponent = ({ form, kapp, onSave }) => {
  return (
    <FormForm
      kappSlug={kapp.slug}
      formSlug={form.slug}
      fieldSet={fieldSet}
      onSave={onSave}
      components={{ FormLayout }}
      addDataSources={{
        notifications: {
          fn: searchSubmissions,
          params: [
            {
              datastore: true,
              form: 'notification-data',
              search: notificationSearch,
            },
          ],
          transform: result => result.submissions,
        },
      }}
      addFields={() => ({ form, notifications }) =>
        form && [
          {
            name: 'permittedSubtasks',
            label: 'Permitted Subtasks',
            type: 'text-multi',
            helpText: 'TBD',
            initialValue: form.getIn(['attributesMap', 'Permitted Subtasks', 0])
              ? form
                  .getIn(['attributesMap', 'Permitted Subtasks', 0])
                  .split(',')
              : [],
          },
          {
            name: 'prohibitSubtasks',
            label: 'Prohibit Subtasks',
            type: 'select',
            helpText: 'TBD',
            initialValue: form
              .getIn(['attributesMap', 'Prohibit Subtasks'])
              .toJS(),
            options: ['Yes', 'No'].map(el => ({ label: el, value: el })),
          },
          {
            name: 'owningTeam',
            label: 'Owning Teams',
            type: 'team-multi',
            helpText: 'Teams responsible for maintaining this form.',
            initialValue: form
              .getIn(['attributesMap', 'Owning Team'])
              .map(name => ({ name }))
              .toJS(),
          },
          {
            name: 'allowReassignment',
            label: 'Allow Reassignment',
            type: 'select',
            helpText: 'TBD',
            initialValue: form
              .getIn(['attributesMap', 'Allow Reassignment'])
              .toJS(),
            options: ['Yes', 'No'].map(el => ({ label: el, value: el })),
          },
          {
            name: 'assignableTeams',
            label: 'Assignable Teams',
            type: 'team-multi',
            helpText: 'TBD',
            initialValue: form
              .getIn(['attributesMap', 'Assignable Teams'])
              .map(name => ({ name }))
              .toJS(),
          },
          {
            name: 'notificationCreate',
            label: 'Notification Template Name - Create',
            type: 'select',
            renderAttributes: { typeahead: true },
            helpText:
              "Name of the Notification Template to use when this form's submission is submitted. Defaults to value at Kapp level.",
            initialValue: form.getIn([
              'attributesMap',
              'Notification Template Name - Create',
              0,
            ]),
            options: notifications
              ? notifications
                  .map(notification => ({
                    label: notification.getIn(['values', 'Name']),
                    value: notification.getIn(['values', 'Name']),
                    slug: notification.get('id'),
                  }))
                  .toJS()
              : [],
            component: FormComponents.NotificationField,
          },
          {
            name: 'notificationComplete',
            label: 'Notification Template Name - Complete',
            type: 'select',
            renderAttributes: { typeahead: true },
            helpText:
              "Name of the Notification Template to use when this form's submission is completed. Defaults to value at Kapp level.",
            initialValue: form.getIn([
              'attributesMap',
              'Notification Template Name - Complete',
              0,
            ]),
            options: notifications
              ? notifications
                  .map(notification => ({
                    label: notification.getIn(['values', 'Name']),
                    value: notification.getIn(['values', 'Name']),
                    slug: notification.get('id'),
                  }))
                  .toJS()
              : [],
            component: FormComponents.NotificationField,
          },
          {
            name: 'submissionTableFields',
            label: 'Submission Table - Fields',
            type: 'custom',
            helpText:
              'Select which field columns should be visible by default when displaying submissions for this form in the settings pages. Drag and drop to change the order in which the columns will appear.',
            initialValue: buildFormConfigurationObject(form.toJS()).columns,
            component: FieldsTableField,
          },
        ]}
      alterFields={{
        description: { component: FormComponents.TextAreaField },
        attributesMap: {
          serialize: ({ values }) => ({
            'Permitted Subtasks': asArray(values.get('permittedSubtasks')),
            'Prohibit Subtasks': asArray(values.get('prohibitSubtasks')),
            'Owning Team': values
              .get('owningTeam')
              .map(team => team.get('name')),
            'Allow Reassignment': asArray(values.get('allowReassignment')),
            'Assignable Teams': asArray(values.getIn('assignableTeams')),
            'Notification Template Name - Create': asArray(
              values.get('notificationCreate'),
            ),
            'Notification Template Name - Complete': asArray(
              values.get('notificationComplete'),
            ),
            'Form Configuration': [
              // TODO Update to allow for other props in Form Config attribute
              JSON.stringify({
                columns: values.get('submissionTableFields').toJS(),
              }),
            ],
          }),
        },
      }}
    >
      {({ form: formContent, initialized }) => (
        <div className="page-container">
          <PageTitle parts={['Settings', form.name, 'Forms']} />
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="../../../../">
                    <I18n>queue</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../../../">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../../">
                    <I18n>forms</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../">
                    <I18n>{form.name}</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>Settings</I18n>
                </h1>
              </div>
              <div className="page-title__actions">
                <a
                  href={`/app/builder/#/${kapp.slug}/forms/${
                    form.slug
                  }/builder`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="fa fa-fw fa-mouse-pointer" />
                  <I18n>Form Builder</I18n>
                </a>
              </div>
            </div>
            {initialized ? (
              <section className="form">{formContent}</section>
            ) : (
              <LoadingMessage />
            )}
          </div>
        </div>
      )}
    </FormForm>
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
});

const mapDispatchToProps = { fetchFormRequest: actions.fetchFormRequest };

export const FormSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    onSave: props => () => () => {
      props.fetchFormRequest({
        kappSlug: props.kapp.slug,
        formSlug: props.form.slug,
      });
      addToast(`${props.form.name} settings saved successfully.`);
    },
  }),
)(FormSettingsComponent);
