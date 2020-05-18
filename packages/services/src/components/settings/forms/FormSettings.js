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
import {
  FormComponents,
  LoadingMessage,
  Utils,
  addToast,
  selectQueueKappSlug,
} from 'common';
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
  'name',
  'slug',
  'status',
  'type',
  'submissionLabelExpression',
  'description',
  'categorizations',
  'attributesMap',
  'icon',
  'owningTeam',
  'approver',
  'approvalForm',
  'notificationCreate',
  'notificationComplete',
  'serviceDaysDue',
  'taskAssigneeTeam',
  'taskForm',
  'createdWorkflow',
  'submittedWorkflow',
  'updatedWorkflow',
  'submissionTableFields',
];

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <I18n>General</I18n>
    </h2>
    <div className="form-group__columns">
      {fields.get('name')}
      {fields.get('slug')}
    </div>
    <div className="form-group__columns">
      {fields.get('status')}
      {fields.get('type')}
    </div>
    {fields.get('submissionLabelExpression')}
    {fields.get('description')}
    {fields.get('categorizations')}
    <br />
    <h2 className="section__title">
      <I18n>Attributes</I18n>
    </h2>
    {fields.get('icon')}
    {fields.get('owningTeam')}
    {fields.get('approver')}
    {fields.get('approvalForm')}
    {fields.get('notificationCreate')}
    {fields.get('notificationComplete')}
    {fields.get('serviceDaysDue')}
    {fields.get('taskAssigneeTeam')}
    {fields.get('taskForm')}
    <br />
    <h2 className="section__title">
      <I18n>Workflow</I18n>
    </h2>
    {fields.get('createdWorkflow')}
    {fields.get('submittedWorkflow')}
    {fields.get('updatedWorkflow')}
    <br />
    <h2 className="section__title">
      <I18n>Submission Table - Default Columns</I18n>
    </h2>
    {fields.get('submissionTableFields')}
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

export const FormSettingsComponent = ({
  form,
  kapp,
  queueKappSlug,
  onSave,
  taskSourceName,
}) => {
  const WorkflowField = FormComponents.WorkflowField({
    taskSourceName,
    kappSlug: kapp.slug,
    formSlug: form.slug,
  });
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
        form &&
        notifications && [
          {
            name: 'icon',
            label: 'Display Icon',
            type: 'text',
            helpText: 'Font Awesome icon to display in Kapp links.',
            initialValue: form.getIn(['attributesMap', 'Icon', 0]),
            component: FormComponents.IconField,
          },
          {
            name: 'owningTeam',
            label: 'Owning Team',
            type: 'team-multi',
            helpText: 'Teams responsible for maintaining this form.',
            initialValue: form
              .getIn(['attributesMap', 'Owning Team'])
              .map(name => ({ name }))
              .toJS(),
          },
          {
            name: 'approver',
            label: 'Approver',
            type: 'text',
            helpText:
              "Options are: Team Name, Individual Name or 'Manager'. If this is set, this form will get approvals sent to the value set here. Defaults to value at Kapp level.",
            initialValue: form.getIn(['attributesMap', 'Approver', 0]),
          },
          {
            name: 'approvalForm',
            label: 'Approval Form',
            type: 'form',
            helpText:
              'The Queue kapp form which approvals should be created in. Defaults to value at Kapp level.',
            initialValue: form
              .getIn(['attributesMap', 'Approval Form Slug'])
              .map(slug => ({ slug }))
              .toJS()[0],
            search: { kappSlug: queueKappSlug },
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
            name: 'serviceDaysDue',
            label: 'Service Days Due',
            type: 'text',
            helpText:
              'Number of days until service is expected to be fulfilled this form. Defaults to value at Kapp level.',
            initialValue: form.getIn(['attributesMap', 'Service Days Due', 0]),
            component: FormComponents.IntegerField,
          },
          {
            name: 'taskAssigneeTeam',
            label: 'Task Assignee Team',
            type: 'team',
            helpText:
              'Team to assign tasks to. Defaults to value at Kapp level.',
            initialValue: form
              .getIn(['attributesMap', 'Task Assignee Team'])
              .map(name => ({ name }))
              .toJS()[0],
          },
          {
            name: 'taskForm',
            label: 'Task Form',
            type: 'form',
            helpText:
              'The Queue kapp form to use when creating a task item. Defaults to value at Kapp level.',
            initialValue: form
              .getIn(['attributesMap', 'Task Form Slug'])
              .map(slug => ({ slug }))
              .toJS()[0],
            search: { kappSlug: queueKappSlug },
          },
          {
            name: 'createdWorkflow',
            label: 'Created',
            type: 'checkbox',
            helpText: 'If unchecked, default workflow will be used.',
            initialValue: form
              .getIn(['attributesMap', 'Custom Submission Workflow'])
              .includes('Created'),
            component: WorkflowField,
          },
          {
            name: 'submittedWorkflow',
            label: 'Submitted',
            type: 'checkbox',
            helpText: 'If unchecked, default workflow will be used.',
            initialValue: form
              .getIn(['attributesMap', 'Custom Submission Workflow'])
              .includes('Submitted'),
            component: WorkflowField,
          },
          {
            name: 'updatedWorkflow',
            label: 'Updated',
            type: 'checkbox',
            helpText: 'If unchecked, default workflow will be used.',
            initialValue: form
              .getIn(['attributesMap', 'Custom Submission Workflow'])
              .includes('Updated'),
            component: WorkflowField,
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
        categorizations: {
          component: FormComponents.SelectMultiField,
          renderAttributes: { typeahead: true },
        },
        attributesMap: {
          serialize: ({ values }) => ({
            Icon: asArray(values.get('icon')),
            'Owning Team': values
              .get('owningTeam')
              .map(team => team.get('name')),
            Approver: asArray(values.get('approver')),
            'Approval Form Slug': asArray(
              values.getIn(['approvalForm', 'slug']),
            ),
            'Notification Template Name - Create': asArray(
              values.get('notificationCreate'),
            ),
            'Notification Template Name - Complete': asArray(
              values.get('notificationComplete'),
            ),
            'Service Days Due': asArray(values.get('serviceDaysDue')),
            'Task Assignee Team': asArray(
              values.getIn(['taskAssigneeTeam', 'name']),
            ),
            'Task Form Slug': asArray(values.getIn(['taskForm', 'slug'])),
            'Custom Submission Workflow': [
              values.get('createdWorkflow') ? 'Created' : '',
              values.get('submittedWorkflow') ? 'Submitted' : '',
              values.get('updatedWorkflow') ? 'Updated' : '',
            ].filter(v => v),
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
              <div
                role="navigation"
                aria-label="breadcrumbs"
                className="page-title__breadcrumbs"
              >
                <span className="breadcrumb-item">
                  <span className="breadcrumb-item">
                    <Link to="../../../../">
                      <I18n>services</I18n>
                    </Link>
                  </span>{' '}
                  <span aria-hidden="true">/ </span>
                  <span className="breadcrumb-item">
                    <Link to="../../../">
                      <I18n>settings</I18n>
                    </Link>
                  </span>{' '}
                  <span aria-hidden="true">/ </span>
                  <span className="breadcrumb-item">
                    <Link to="../../">
                      <I18n>forms</I18n>
                    </Link>
                  </span>{' '}
                  <span aria-hidden="true">/ </span>
                  <span className="breadcrumb-item">
                    <Link to="../">
                      <I18n>{form.name}</I18n>
                    </Link>
                  </span>{' '}
                  <span aria-hidden="true">/ </span>
                </span>
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
  queueKappSlug: selectQueueKappSlug(state),
  taskSourceName: Utils.getAttributeValue(state.app.space, 'Task Source Name'),
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
