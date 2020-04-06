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
  // 'name',
  // 'slug',
  'description',
  'type',
  'status',
  // 'submissionLabelExpression',
  // 'categorizations',
  'submissionTableFields',
  'attributesMap',
  // 'icon',
  'owningTeam',
  // 'approver',
  // 'approvalForm',
  'notificationCreate',
  'notificationComplete',
  // 'serviceDaysDue',
  // 'taskAssigneeTeam',
  // 'taskForm',
  // 'createdWorkflow',
  // 'submittedWorkflow',
  // 'updatedWorkflow',
];

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <I18n>General Settings</I18n>
    </h2>
    {/* <div className="form-group__columns">
      {fields.get('name')}
      {fields.get('slug')}
    </div> */}
    {fields.get('description')}
    <div className="form-group__columns">
      {fields.get('type')}
      {fields.get('status')}
    </div>
    {/* {fields.get('submissionLabelExpression')}
    {fields.get('categorizations')} */}
    <br />
    <h2 className="section__title">
      <I18n>Attributes</I18n>
    </h2>
    {/* {fields.get('icon')} */}
    {fields.get('owningTeam')}
    {/* {fields.get('approver')}
    {fields.get('approvalForm')} */}
    {fields.get('notificationCreate')}
    {fields.get('notificationComplete')}
    {/* {fields.get('serviceDaysDue')} */}
    {/* {fields.get('taskAssigneeTeam')} */}
    {/* {fields.get('taskForm')} */}
    <br />
    {/* <h2 className="section__title">
      <I18n>Workflow</I18n>
    </h2> */}
    {/* {fields.get('createdWorkflow')}
    {fields.get('submittedWorkflow')}
    {fields.get('updatedWorkflow')} */}
    {/* <br /> */}
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
  // queueKappSlug,
  onSave,
  // taskSourceName,
}) => {
  // const WorkflowField = FormComponents.WorkflowField({
  //   taskSourceName,
  //   kappSlug: kapp.slug,
  //   formSlug: form.slug,
  // });
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
          // {
          //   name: 'icon',
          //   label: 'Display Icon',
          //   type: 'text',
          //   helpText: 'Font Awesome icon to display in Kapp links.',
          //   initialValue: form.getIn(['attributesMap', 'Icon', 0]),
          //   component: FormComponents.IconField,
          // },
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
          // {
          //   name: 'approver',
          //   label: 'Approver',
          //   type: 'text',
          //   helpText:
          //     "Options are: Team Name, Individual Name or 'Manager'. If this is set, this form will get approvals sent to the value set here. Defaults to value at Kapp level.",
          //   initialValue: form.getIn(['attributesMap', 'Approver', 0]),
          // },
          // {
          //   name: 'approvalForm',
          //   label: 'Approval Form',
          //   type: 'form',
          //   helpText:
          //     'The Queue kapp form which approvals should be created in. Defaults to value at Kapp level.',
          //   initialValue: form
          //     .getIn(['attributesMap', 'Approval Form Slug'])
          //     .map(slug => ({ slug }))
          //     .toJS()[0],
          //   search: { kappSlug: queueKappSlug },
          // },
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
                  }))
                  .toJS()
              : [],
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
                  }))
                  .toJS()
              : [],
          },
          // {
          //   name: 'serviceDaysDue',
          //   label: 'Service Days Due',
          //   type: 'text',
          //   helpText:
          //     'Number of days until service is expected to be fulfilled this form. Defaults to value at Kapp level.',
          //   initialValue: form.getIn(['attributesMap', 'Service Days Due', 0]),
          //   component: FormComponents.IntegerField,
          // },
          // {
          //   name: 'taskAssigneeTeam',
          //   label: 'Task Assignee Team',
          //   type: 'team',
          //   helpText:
          //     'Team to assign tasks to. Defaults to value at Kapp level.',
          //   initialValue: form
          //     .getIn(['attributesMap', 'Task Assignee Team'])
          //     .map(name => ({ name }))
          //     .toJS()[0],
          // },
          // {
          //   name: 'taskForm',
          //   label: 'Task Form',
          //   type: 'form',
          //   helpText:
          //     'The Queue kapp form to use when creating a task item. Defaults to value at Kapp level.',
          //   initialValue: form
          //     .getIn(['attributesMap', 'Task Form Slug'])
          //     .map(slug => ({ slug }))
          //     .toJS()[0],
          //   search: { kappSlug: queueKappSlug },
          // },
          // {
          //   name: 'createdWorkflow',
          //   label: 'Created',
          //   type: 'checkbox',
          //   helpText: 'If unchecked, default workflow will be used.',
          //   initialValue: form
          //     .getIn(['attributesMap', 'Custom Submission Workflow'])
          //     .includes('Created'),
          //   component: WorkflowField,
          // },
          // {
          //   name: 'submittedWorkflow',
          //   label: 'Submitted',
          //   type: 'checkbox',
          //   helpText: 'If unchecked, default workflow will be used.',
          //   initialValue: form
          //     .getIn(['attributesMap', 'Custom Submission Workflow'])
          //     .includes('Submitted'),
          //   component: WorkflowField,
          // },
          // {
          //   name: 'updatedWorkflow',
          //   label: 'Updated',
          //   type: 'checkbox',
          //   helpText: 'If unchecked, default workflow will be used.',
          //   initialValue: form
          //     .getIn(['attributesMap', 'Custom Submission Workflow'])
          //     .includes('Updated'),
          //   component: WorkflowField,
          // },
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
        // categorizations: { component: FormComponents.SelectMultiField },
        attributesMap: {
          serialize: ({ values }) => ({
            // Icon: asArray(values.get('icon')),
            'Owning Team': values
              .get('owningTeam')
              .map(team => team.get('name')),
            // Approver: asArray(values.get('approver')),
            // 'Approval Form Slug': asArray(
            //   values.getIn(['approvalForm', 'slug']),
            // ),
            'Notification Template Name - Create': asArray(
              values.get('notificationCreate'),
            ),
            'Notification Template Name - Complete': asArray(
              values.get('notificationComplete'),
            ),
            // 'Service Days Due': asArray(values.get('serviceDaysDue')),
            'Task Assignee Team': asArray(
              values.getIn(['taskAssigneeTeam', 'name']),
            ),
            // 'Task Form Slug': asArray(values.getIn(['taskForm', 'slug'])),
            // 'Custom Submission Workflow': [
            //   values.get('createdWorkflow') ? 'Created' : '',
            //   values.get('submittedWorkflow') ? 'Submitted' : '',
            //   values.get('updatedWorkflow') ? 'Updated' : '',
            // ].filter(v => v),
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
  // queueKappSlug: selectQueueKappSlug(state),
  // taskSourceName: Utils.getAttributeValue(state.app.space, 'Task Source Name'),
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

// import React from 'react';
// import { Link } from '@reach/router';
// import { bundle } from '@kineticdata/react';
// import { compose, lifecycle, withState, withHandlers } from 'recompose';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import {
//   actions,
//   buildFormConfigurationObject,
// } from '../../../redux/modules/settingsForms';
// import { PageTitle } from '../../shared/PageTitle';

// import { actions as queueActions } from '../../../redux/modules/settingsQueue';
// import { I18n } from '@kineticdata/react';
// import { connect } from '../../../redux/store';

// export const TextInput = ({ value, name, setInputs, inputs, className }) => (
//   <input
//     className={`form-control ${className}`}
//     name={name}
//     value={value || ''}
//     type="text"
//     onChange={event => {
//       setInputs({ ...inputs, [name]: event.target.value });
//     }}
//   />
// );
// export const NumberInput = ({ value, name, setInputs, inputs, className }) => (
//   <input
//     className={`form-control ${className}`}
//     name={name}
//     value={value || ''}
//     type="number"
//     onChange={event => setInputs({ ...inputs, [name]: event.target.value })}
//   />
// );
// export const Select = ({
//   selected,
//   name,
//   type,
//   data,
//   setInputs,
//   inputs,
//   className,
//   multiple,
// }) => {
//   let optionElements = '<option></option>';
//   let options;
//   if (data) {
//     const kappName = type.charAt(0).toUpperCase() + type.slice(1);
//     if (type === 'teams') {
//       options = data.filter(team => !team.name.includes('Role')).map(team => {
//         return { value: team.name, label: `${kappName} > ${team.name}` };
//       });
//     } else if (type === 'notifications') {
//       options = data.map(notification => {
//         return {
//           value: notification.values.Name,
//           label: `${kappName} > ${notification.values.Name}`,
//         };
//       });
//     } else if (type === 'subtasks') {
//       options = data.forms
//         .filter(form => form.type === 'Task' || form.type === 'Subtask')
//         .map(form => ({ value: form.slug, label: form.name }));
//     } else {
//       options = data.kapps.find(kapp => kapp.slug === type).forms.map(form => {
//         return { value: form.slug, label: `${kappName} > ${form.label}` };
//       });
//     }
//     optionElements = options.map(option => {
//       return (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       );
//     });
//   }
//   return (
//     <select
//       className={`form-control ${className}`}
//       name={name}
//       value={selected}
//       onChange={event => {
//         let value = event.target.value;
//         if (multiple) {
//           const options = event.target.options;
//           value = [];
//           for (let i = 0, l = options.length; i < l; i++) {
//             if (options[i].selected) {
//               value.push(options[i].value);
//             }
//           }
//         }
//         setInputs({ ...inputs, [name]: value });
//       }}
//       multiple={multiple}
//     >
//       <option />
//       {optionElements}
//     </select>
//   );
// };

// export const FormContainer = ({
//   updateFormSettings,
//   inputs,
//   setInputs,
//   loading,
//   form,
//   kappLoading,
//   settingsForms,
//   queueSettings: {
//     queueSettingsKapp: kapp,
//     loading: loadingQueue,
//     loadingTeams,
//     teams,
//     spaceKapps,
//   },
//   kappSlug,
//   notificationsLoading,
//   notifications,
//   handleColumnOrderChange,
//   handleColumnChange,
// }) =>
//   !loading &&
//   !kappLoading &&
//   !loadingTeams &&
//   !loadingQueue &&
//   !notificationsLoading &&
//   form && (
//     <div className="page-container page-container--panels">
//       <PageTitle parts={['Settings', form.name]} />
//       <div className="page-panel page-panel--two-thirds page-panel--white">
//         <div className="page-title">
//           <div className="page-title__wrapper">
//             <h3>
//               <Link to="../../../..">
//                 <I18n>queue</I18n>
//               </Link>{' '}
//               /{` `}
//               <Link to="../../..">
//                 <I18n>settings</I18n>
//               </Link>{' '}
//               /{` `}
//               <Link to="../..">
//                 <I18n>forms</I18n>
//               </Link>{' '}
//               /{` `}
//               <Link to="..">
//                 <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
//                   {form.name}
//                 </I18n>
//               </Link>{' '}
//             </h3>
//             <h1>
//               <I18n>Form Settings</I18n>
//             </h1>
//           </div>
//           <a
//             href={`${bundle.spaceLocation()}/app/builder/#/${kappSlug}/forms/${
//               form.slug
//             }/builder`}
//             className="btn btn-primary"
//             target="_blank"
//           >
//             <I18n>Form Builder</I18n>{' '}
//             <i className="fa fa-fw fa-external-link" />
//           </a>
//         </div>
//         <div className="general-settings">
//           <h3 className="section__title">
//             <I18n>General Settings</I18n>
//           </h3>
//           <div className="form settings">
//             <div className="form-group">
//               <label>
//                 <I18n>Description</I18n>
//               </label>
//               <textarea
//                 className="form-control col-12"
//                 name="description"
//                 value={inputs.description}
//                 type="text"
//                 onChange={event =>
//                   setInputs({
//                     ...inputs,
//                     description: event.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="form-group">
//               <label>
//                 <I18n>Form Type</I18n>
//               </label>
//               <select
//                 className="form-control col-6"
//                 name="type"
//                 value={inputs.type}
//                 onChange={event =>
//                   setInputs({ ...inputs, type: event.target.value })
//                 }
//               >
//                 {settingsForms.queueKapp.formTypes.map(type => (
//                   <option key={type.name} value={type.name}>
//                     {type.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group">
//               <label>
//                 <I18n>Form Status</I18n>
//               </label>
//               <select
//                 className="form-control col-6"
//                 name="status"
//                 value={inputs.status}
//                 onChange={event =>
//                   setInputs({ ...inputs, status: event.target.value })
//                 }
//               >
//                 <option key="New">New</option>
//                 <option key="Active">Active</option>
//                 <option key="Inactive">Inactive</option>
//                 <option key="Delete">Delete</option>
//               </select>
//             </div>
//           </div>
//         </div>
//         <div className="table-display-settings">
//           <h3 className="section__title">Table Display Settings</h3>
//           <div className="form settings">
//             <table className="table table-datastore table-draggable">
//               <thead>
//                 <tr className="header">
//                   <th>
//                     <I18n>Field</I18n>
//                   </th>
//                   <th>
//                     <I18n>Visible in Table</I18n>
//                   </th>
//                 </tr>
//               </thead>
//               {inputs.columns && (
//                 <DragDropContext onDragEnd={handleColumnOrderChange}>
//                   <Droppable droppableId="columns">
//                     {provided => (
//                       <tbody ref={provided.innerRef}>
//                         {inputs.columns.map((col, index) => (
//                           <Draggable
//                             key={col.name}
//                             draggableId={col.name}
//                             index={index}
//                           >
//                             {(provided, snapshot) => (
//                               <tr
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 className={`${
//                                   snapshot.isDragging ? 'dragging' : ''
//                                 }`}
//                               >
//                                 <td>
//                                   {col.type === 'value' ? (
//                                     <I18n>{col.label}</I18n>
//                                   ) : (
//                                     <i>
//                                       <I18n>{col.label}</I18n>{' '}
//                                       <small>
//                                         <I18n>(system field)</I18n>
//                                       </small>
//                                     </i>
//                                   )}
//                                 </td>
//                                 <td>
//                                   <input
//                                     onChange={e =>
//                                       handleColumnChange(
//                                         index,
//                                         'visible',
//                                         e.target.checked,
//                                       )
//                                     }
//                                     type="checkbox"
//                                     checked={col.visible}
//                                   />
//                                 </td>
//                               </tr>
//                             )}
//                           </Draggable>
//                         ))}
//                       </tbody>
//                     )}
//                   </Droppable>
//                 </DragDropContext>
//               )}
//             </table>
//           </div>
//         </div>
//         <div className="attribute-settings">
//           <h3 className="section__title">
//             <I18n>Attributes</I18n>
//           </h3>
//           <div className="form settings">
//             {inputs['Permitted Subtasks'] && (
//               <div className="form-group">
//                 <label>
//                   <I18n>Permitted Subtasks</I18n>
//                 </label>
//                 <Select
//                   selected={inputs['Permitted Subtasks']}
//                   name="Permitted Subtasks"
//                   type="subtasks"
//                   data={kapp}
//                   setInputs={setInputs}
//                   inputs={inputs}
//                   className="col-8"
//                   multiple
//                 />
//               </div>
//             )}
//             {inputs['Prohibit Subtasks'] && (
//               <div className="form-group">
//                 <label>
//                   <I18n>Prohibit Subtasks</I18n>
//                 </label>
//                 <I18n
//                   render={translate => (
//                     <select
//                       value={
//                         inputs['Prohibit Subtasks'] === 'Yes' ||
//                         inputs['Prohibit Subtasks'] === 'True'
//                           ? 'Yes'
//                           : 'No'
//                       }
//                       onChange={event =>
//                         setInputs({
//                           ...inputs,
//                           'Prohibit Subtasks': event.target.value,
//                         })
//                       }
//                       className="form-control col-8"
//                     >
//                       <option value="No">{translate('No')}</option>
//                       <option value="Yes">{translate('Yes')}</option>
//                     </select>
//                   )}
//                 />
//               </div>
//             )}
//             <div className="form-group">
//               <label>
//                 <I18n>Owning Team</I18n>
//               </label>
//               <Select
//                 selected={inputs['Owning Team']}
//                 name="Owning Team"
//                 type="teams"
//                 data={teams}
//                 setInputs={setInputs}
//                 inputs={inputs}
//                 className="col-8"
//                 multiple
//               />
//             </div>

//             {inputs['Allow Reassignment'] && (
//               <div className="form-group">
//                 <label>
//                   <I18n>Allow Reassignment</I18n>
//                 </label>
//                 <I18n
//                   render={translate => (
//                     <select
//                       value={
//                         inputs['Allow Reassignment'] === 'No' ||
//                         inputs['Allow Reassignment'] === 'False'
//                           ? 'No'
//                           : 'Yes'
//                       }
//                       onChange={event =>
//                         setInputs({
//                           ...inputs,
//                           'Allow Reassignment': event.target.value,
//                         })
//                       }
//                       className="form-control col-8"
//                     >
//                       <option value="No">{translate('No')}</option>
//                       <option value="Yes">{translate('Yes')}</option>
//                     </select>
//                   )}
//                 />
//               </div>
//             )}

//             {inputs['Assignable Teams'] && (
//               <div className="form-group">
//                 <label>
//                   <I18n>Assignable Teams</I18n>
//                 </label>
//                 <Select
//                   selected={inputs['Assignable Teams']}
//                   name="Assignable Teams"
//                   type="teams"
//                   data={teams}
//                   setInputs={setInputs}
//                   inputs={inputs}
//                   className="col-8"
//                   multiple
//                 />
//               </div>
//             )}

//             <div className="form-group">
//               <label>
//                 <I18n>Notification Template Name - Complete</I18n>
//               </label>
//               <Select
//                 selected={inputs['Notification Template Name - Complete']}
//                 name="Notification Template Name - Complete"
//                 type="notifications"
//                 data={notifications}
//                 setInputs={setInputs}
//                 inputs={inputs}
//                 className="col-8"
//               />
//             </div>

//             <div className="form-group">
//               <label>
//                 <I18n>Notification Template Name - Create</I18n>
//               </label>
//               <Select
//                 selected={inputs['Notification Template Name - Create']}
//                 name="Notification Template Name - Create"
//                 type="notifications"
//                 data={notifications}
//                 setInputs={setInputs}
//                 inputs={inputs}
//                 className="col-8"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="form__footer">
//           <span className="form__footer__right">
//             <button
//               className="btn btn-primary"
//               onClick={() => {
//                 const newObj = { form, inputs, kappSlug };
//                 updateFormSettings(newObj);
//               }}
//             >
//               <I18n>Save Changes</I18n>
//             </button>
//           </span>
//         </div>
//       </div>
//       <div className="page-panel page-panel--one-thirds page-panel--sidebar">
//         <h3>
//           <I18n>Form Settings</I18n>
//         </h3>
//         <h4>
//           <I18n>General Settings</I18n>
//         </h4>
//         <p>
//           <I18n>
//             To update the form fields, click the Form Builder button, which will
//             open the form builder in a new window. You will need to reload this
//             page after making changes in the form builder.
//           </I18n>
//         </p>
//         <h4>
//           <I18n>Table Display Settings</I18n>
//         </h4>
//         <p>
//           <I18n>
//             The Display Table Settings section lists all of the fields that
//             exist on this form. You may select which fields you'd like to be
//             visible in the table when viewing records.
//           </I18n>
//         </p>
//         <h4>
//           <I18n>Categories</I18n>
//         </h4>
//         <p>
//           <I18n>
//             You can update the categories associated with this form by checking
//             them off in the Category Settings area.
//           </I18n>
//         </p>
//       </div>
//     </div>
//   );

// export const setInitialInputs = ({ setInputs, form }) => () => {
//   const config = buildFormConfigurationObject(form);
//   setInputs({
//     description: form.description,
//     type: form.type,
//     status: form.status,
//     'Permitted Subtasks': form.attributesMap['Permitted Subtasks']
//       ? form.attributesMap['Permitted Subtasks'][0]
//         ? form.attributesMap['Permitted Subtasks'][0].split(',')
//         : []
//       : '',
//     'Prohibit Subtasks': form.attributesMap['Prohibit Subtasks']
//       ? form.attributesMap['Prohibit Subtasks'][0]
//         ? form.attributesMap['Prohibit Subtasks'][0]
//         : 'No'
//       : '',
//     'Owning Team': form.attributesMap['Owning Team']
//       ? form.attributesMap['Owning Team']
//       : '',
//     'Allow Reassignment': form.attributesMap['Allow Reassignment']
//       ? form.attributesMap['Allow Reassignment'][0]
//         ? form.attributesMap['Allow Reassignment'][0]
//         : 'Yes'
//       : '',
//     'Assignable Teams': form.attributesMap['Assignable Teams']
//       ? form.attributesMap['Assignable Teams']
//       : '',
//     'Notification Template Name - Complete': form.attributesMap[
//       'Notification Template Name - Complete'
//     ]
//       ? form.attributesMap['Notification Template Name - Complete'][0]
//       : '',
//     'Notification Template Name - Create': form.attributesMap[
//       'Notification Template Name - Create'
//     ]
//       ? form.attributesMap['Notification Template Name - Create'][0]
//       : '',
//     columns: config.columns,
//   });
// };

// const handleColumnOrderChange = ({ setInputs, inputs }) => ({
//   source,
//   destination,
// }) => {
//   if (destination && source.index !== destination.index) {
//     const updated = inputs.columns.update(cols => {
//       const col = cols.get(source.index);
//       return cols.delete(source.index).insert(destination.index, col);
//     });
//     setInputs({ ...inputs, columns: updated });
//   }
// };

// const handleColumnChange = ({ setInputs, inputs }) => (index, prop, value) => {
//   const updated = inputs.columns.setIn([index, prop], value);
//   setInputs({ ...inputs, columns: updated });
// };

// const mapStateToProps = state => ({
//   form: state.settingsForms.currentForm,
//   formChanges: state.settingsForms.currentFormChanges,
//   loading: state.settingsForms.loading,
//   kappLoading: state.settingsForms.kappLoading,
//   notificationsLoading: state.settingsForms.notificationsLoading,
//   notifications: state.settingsForms.notifications,
//   settingsForms: state.settingsForms,
//   queueSettings: state.queueSettings,
//   kappSlug: state.app.kappSlug,
// });

// const mapDispatchToProps = {
//   updateFormSettings: actions.updateForm,
//   fetchFormSettings: actions.fetchForm,
//   fetchKapp: actions.fetchKapp,
//   fetchNotifications: actions.fetchNotifications,
//   fetchQueueSettings: queueActions.fetchQueueSettings,
//   fetchQueueSettingsTeams: queueActions.fetchQueueSettingsTeams,
//   fetchQueueSettingsSpace: queueActions.fetchQueueSettingsSpace,
// };

// export const FormSettings = compose(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//   ),
//   withState('inputs', 'setInputs', {}),
//   withHandlers({
//     setInitialInputs,
//     handleColumnOrderChange,
//     handleColumnChange,
//   }),
//   lifecycle({
//     componentWillMount() {
//       this.props.fetchFormSettings({
//         formSlug: this.props.id,
//         kappSlug: this.props.kappSlug,
//       });
//       this.props.fetchKapp(this.props.kappSlug);
//       this.props.fetchNotifications();
//       this.props.fetchQueueSettings();
//       this.props.fetchQueueSettingsTeams();
//       this.props.fetchQueueSettingsSpace();
//     },
//     componentWillReceiveProps(nextProps) {
//       nextProps.loading === false &&
//         nextProps.form !== this.props.form &&
//         nextProps.setInitialInputs();
//     },
//   }),
// )(FormContainer);
