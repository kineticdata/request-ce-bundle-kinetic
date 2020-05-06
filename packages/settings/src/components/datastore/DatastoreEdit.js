import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { I18n, FormForm } from '@kineticdata/react';
import { compose, withHandlers } from 'recompose';
import { connect } from '../../redux/store';
import { FormComponents, LoadingMessage, addToast } from 'common';
import { actions, buildConfig } from '../../redux/modules/settingsDatastore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PageTitle } from '../shared/PageTitle';

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

// const fieldSet = [
//   'name',
//   'slug',
//   'description',
//   'submissionTableFields', //defaultSearchIndex
//   'bridgeSlug',
//   'bridgeModel',
//   'bridgeModelMapping',
// ];

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <br />
      <I18n>General Settings</I18n>
    </h2>
    <div className="form-group__columns">
      {fields.get('name')}
      {fields.get('slug')}
    </div>
    {fields.get('description')}
    <h2 className="section__title">
      <br />
      <I18n>Table Display Settings</I18n>
    </h2>
    {fields.get('submissionTableFields')}
    <h2 className="section__title">
      <br />
      <I18n>Bridge Configuration</I18n>
    </h2>
    {fields.get('bridgeSlug')}
    {fields.get('bridgeModel')}
    {fields.get('bridgeModelMapping')}
    {error}
    {buttons}
  </Fragment>
);

// const asArray = value => (value ? [value] : []);

export const DatastoreEditComponent = ({ onSave, formSlug }) => {
  return (
    <FormForm
      datastore={true}
      formSlug={formSlug}
      //   fieldSet={fieldSet}
      onSave={onSave}
      components={{ FormLayout }}
      addFields={() => ({ form, notifications }) =>
        form && [
          {
            name: 'submissionTableFields',
            label: 'Submission Table - Fields',
            type: 'custom',
            helpText:
              'Select which field columns should be visible by default when displaying submissions for this form in the settings pages. Drag and drop to change the order in which the columns will appear.',
            initialValue: buildConfig(form.toJS()).columns,
            component: FieldsTableField,
          },
        ]}
      alterFields={{
        description: { component: FormComponents.TextAreaField },
      }}
    >
      {({ form: formContent, initialized }) => (
        <div className="page-container">
          <PageTitle parts={['Settings', 'Forms']} />
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="../../../">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                  <Link to="../../">
                    <I18n>datastore</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>Edit Datastore</I18n>
                </h1>
              </div>
              <div className="page-title__actions">
                <a
                  href={`/app/builder/#/forms/${formSlug}/builder`}
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

const mapStateToProps = (state, { slug }) => ({
  formSlug: slug,
});
const mapDispatchToProps = { fetchFormRequest: actions.fetchForm };

export const DatastoreEdit = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    onSave: props => () => () => {
      props.fetchFormRequest(props.formSlug);
      addToast(`${props.formSlug} settings saved successfully.`);
    },
  }),
)(DatastoreEditComponent);
