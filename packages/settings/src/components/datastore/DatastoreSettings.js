import React from 'react';
import axios from 'axios';
import { Modal } from 'reactstrap';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import { bundle } from '@kineticdata/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List } from 'immutable';
import { isBlank } from '../../utils';
import { PageTitle } from '../shared/PageTitle';
import { I18n } from '@kineticdata/react';

import {
  BridgeQualification,
  BridgeModelQualification,
  BridgeModelMappingQualification,
  BridgeAttribute,
} from '../../records';

import { actions } from '../../redux/modules/settingsDatastore';
import { context } from '../../redux/store';

const SettingsComponent = ({
  canManage,
  updatedForm,
  origForm,
  bridges,
  bridgeModel,
  bridgeName,
  handleBridgeChange,
  newQualification,
  setNewQualification,
  newAttribute,
  setNewAttribute,
  editAttribute,
  setEditAttribute,
  canGenerateAttributes,
  generateAttributes,
  columns,
  handleColumnChange,
  handleColumnOrderChange,
  handleFormChange,
  loading,
  hasChanged,
  handleSave,
  handleReset,
  staleFields,
  setStaleFields,
  fetchForm,
}) =>
  !loading && (
    <I18n context={`datastore.forms.${origForm.slug}`}>
      <div className="page-container page-container--panels">
        <PageTitle parts={['Settings', origForm.name, 'Datastore']} />
        <div className="page-panel page-panel--two-thirds page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/settings">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
                <Link to={`/settings/datastore/`}>
                  <I18n>datastore</I18n>
                </Link>{' '}
                /{` `}
                <Link to={`/settings/datastore/${origForm.slug}/`}>
                  <I18n>{origForm.name}</I18n>
                </Link>
              </h3>
              <h1>
                <I18n>Configuration</I18n>
              </h1>
            </div>

            <a
              href={`${bundle.spaceLocation()}/app/#/admin/datastore/form/${
                origForm.slug
              }/builder`}
              className="btn btn-primary"
              target="_blank"
            >
              <I18n>Form Builder</I18n>{' '}
              <i className="fa fa-fw fa-external-link" />
            </a>
          </div>
          {canManage ? (
            <div className="datastore-settings">
              <h3 className="section__title">General Settings</h3>
              <div className="form settings">
                <div className="form-row">
                  <div className="col">
                    <div className="form-group required">
                      <label htmlFor="name">
                        <I18n>Datastore Name</I18n>
                      </label>
                      <input
                        id="name"
                        name="name"
                        onChange={e => {
                          handleFormChange('name', e.target.value);
                          handleBridgeChange('formName', e.target.value);
                        }}
                        value={updatedForm.name}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group required">
                      <label htmlFor="slug">
                        <I18n>Datastore Slug</I18n>
                      </label>
                      <input
                        id="slug"
                        name="slug"
                        onChange={e => handleFormChange('slug', e.target.value)}
                        value={updatedForm.slug}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="name">
                    <I18n>Datastore Description</I18n>{' '}
                    <small>
                      <I18n>(optional)</I18n>
                    </small>
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    onChange={e =>
                      handleFormChange('description', e.target.value)
                    }
                    value={updatedForm.description || ''}
                    rows="3"
                    name="description"
                  />
                </div>
              </div>
              <div className="table-settings">
                <h3 className="section__title">
                  <I18n>Table Display Settings</I18n>
                </h3>
                <div className="form settings">
                  <div className="form-group">
                    <label htmlFor="default-search-index">
                      <I18n>Default Search Index</I18n>
                    </label>
                    <I18n
                      render={translate => (
                        <select
                          id="default-search-index"
                          name="default-search-index"
                          onChange={e => {
                            handleFormChange(
                              'defaultSearchIndex',
                              e.target.value
                                ? {
                                    index: e.target.value,
                                    direction: 'ASC',
                                  }
                                : null,
                            );
                          }}
                          value={
                            (updatedForm.defaultSearchIndex &&
                              updatedForm.defaultSearchIndex.index) ||
                            ''
                          }
                          className="form-control"
                        >
                          <option value="">
                            {translate("Don't perform default search")}
                          </option>
                          <optgroup label={translate('Search by Index:')}>
                            {List(origForm.indexDefinitions)
                              .filter(d => d.status === 'Built')
                              .map(({ name }) => (
                                <option value={name} key={name}>
                                  {name.replace(':UNIQUE', '')}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      )}
                    />
                  </div>
                  {updatedForm.defaultSearchIndex && (
                    <div className="form-group">
                      <label htmlFor="default-search-direction">
                        <I18n>Default Search Sort Direction</I18n>
                      </label>
                      <I18n
                        render={translate => (
                          <select
                            id="default-search-direction"
                            name="default-search-direction"
                            onChange={e => {
                              handleFormChange(
                                'defaultSearchIndex',
                                e.target.value
                                  ? {
                                      index:
                                        updatedForm.defaultSearchIndex.index,
                                      direction: e.target.value,
                                    }
                                  : null,
                              );
                            }}
                            value={
                              (updatedForm.defaultSearchIndex &&
                                updatedForm.defaultSearchIndex.direction) ||
                              'ASC'
                            }
                            className="form-control"
                          >
                            <option value="ASC">
                              {translate('Ascending')}
                            </option>
                            <option value="DESC">
                              {translate('Descending')}
                            </option>
                          </select>
                        )}
                      />
                    </div>
                  )}
                  <table className="table table--settings table-draggable">
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
                    <DragDropContext onDragEnd={handleColumnOrderChange}>
                      <Droppable droppableId="columns">
                        {provided => (
                          <tbody ref={provided.innerRef}>
                            {updatedForm.columns.map((col, index) => (
                              <Draggable
                                key={col.name}
                                draggableId={col.name}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${
                                      snapshot.isDragging ? 'dragging' : ''
                                    }`}
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
                                          handleColumnChange(
                                            index,
                                            'visible',
                                            e.target.checked,
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
                  </table>
                </div>
              </div>
              <div className="table-settings">
                <h3 className="section__title">
                  <I18n>Bridge Configuration</I18n>
                </h3>
                <div className="form settings">
                  <div className="form-group">
                    <label htmlFor="name">
                      <I18n>Bridge Name</I18n>
                    </label>
                    <select
                      id="bridgeName"
                      name="bridgeName"
                      onChange={e =>
                        handleBridgeChange('bridgeName', e.target.value)
                      }
                      value={updatedForm.bridgeName}
                      className="form-control"
                    >
                      {!origForm.bridgeName && <option />}
                      {bridges.map(b => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  {updatedForm.bridgeName && (
                    <div>
                      <div className="form-group">
                        <span>
                          <I18n>Model & Mapping Name:</I18n>{' '}
                        </span>
                        <strong>
                          {updatedForm.bridgeModel.name ||
                            `Datastore - ${updatedForm.name}`}
                        </strong>
                      </div>
                      <QualificationTable
                        updatedForm={updatedForm}
                        handleBridgeChange={handleBridgeChange}
                        setNewQualification={setNewQualification}
                      />
                      <QualificationModal
                        updatedForm={updatedForm}
                        handleBridgeChange={handleBridgeChange}
                        newQualification={newQualification}
                        setNewQualification={setNewQualification}
                      />
                      <AttributeTable
                        updatedForm={updatedForm}
                        editAttribute={editAttribute}
                        setEditAttribute={setEditAttribute}
                        newAttribute={newAttribute}
                        setNewAttribute={setNewAttribute}
                        handleBridgeChange={handleBridgeChange}
                        canGenerateAttributes={canGenerateAttributes}
                        generateAttributes={generateAttributes}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="form__footer">
                <div className="form__footer__right">
                  {hasChanged && (
                    <button
                      type="button"
                      onClick={handleReset()}
                      className="btn btn-link mr-3"
                    >
                      <I18n>Reset</I18n>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSave()}
                    className="btn btn-primary"
                    disabled={!hasChanged}
                  >
                    <I18n>Save Changes</I18n>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>
              <I18n>You do not have access to configure this datastore.</I18n>
            </p>
          )}
        </div>
        <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--datastore-sidebar">
          <h3>
            <I18n>Datastore Configuration</I18n>
          </h3>
          <p>
            <I18n>
              To update the datastore form fields, click the Form Builder
              button, which will open the form builder in a new window. You will
              need to reload this page after making changes in the form builder.
            </I18n>
          </p>
          <h4>
            <I18n>Table Display Settings</I18n>
          </h4>
          <p>
            <I18n>
              The Display Table Settings section lists all of the fields that
              exist in this datastore. You may select which fields you'd like to
              be visible in the table when viewing records.
            </I18n>
          </p>
        </div>
        <Modal
          isOpen={staleFields}
          toggle={() => setStaleFields(false)}
          size="lg"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                onClick={() => setStaleFields(false)}
                type="button"
                className="btn btn-link"
              >
                <I18n>Cancel</I18n>
              </button>
              <span>
                <I18n>Form Has Changed</I18n>
              </span>
            </h4>
          </div>
          <div className="modal-body">
            <div className="modal-form">
              <p>
                <I18n>
                  This datastore's form has been updated. Click reload in order
                  to see the latest fields.
                </I18n>
              </p>
              {hasChanged && (
                <p className="text-danger">
                  <span className="fa fa-exclamation-triangle" />{' '}
                  <I18n>
                    You have unsaved changes that will be lost if you reload
                    now.
                  </I18n>
                </p>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => {
                fetchForm(origForm.slug);
                setStaleFields(false);
              }}
              type="button"
              className="btn btn-primary"
            >
              <I18n>Reload</I18n>
            </button>
          </div>
        </Modal>
      </div>
    </I18n>
  );

const QualificationTable = ({
  updatedForm,
  handleBridgeChange,
  setNewQualification,
}) => (
  <div>
    <div className="table-title">
      <div className="table-title__wrapper">
        <div>
          <I18n>Bridge Qualifications</I18n>
        </div>
      </div>
      <div className="table-title__actions">
        <button
          onClick={() => setNewQualification(BridgeQualification())}
          className="btn btn-primary pull-right"
        >
          <I18n>Add Qualification</I18n>
        </button>
      </div>
    </div>
    <table className="table table--settings">
      <thead>
        <tr className="header">
          <th scope="col">
            <I18n>Qualification Name</I18n>
          </th>
          <th scope="col">
            <I18n>Result Type</I18n>
          </th>
          <th scope="col">
            <I18n>Parameters</I18n>
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {updatedForm.bridgeModel.qualifications.map((qual, index) => (
          <tr key={qual.name}>
            <td>{qual.name}</td>
            <td>
              <I18n>{qual.resultType}</I18n>
            </td>
            <td>
              {qual.parameters.length} <I18n>Parameters</I18n>
            </td>
            <td>
              <div className="btn-group btn-group-sm pull-right">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setNewQualification(
                      BridgeQualification(qual)
                        .merge(
                          updatedForm.bridgeModelMapping.qualifications.get(
                            index,
                          ),
                        )
                        .set('index', index),
                    )
                  }
                >
                  <span className="fa fa-fw fa-pencil" />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleBridgeChange('bridgeQualificationDelete', index)
                  }
                >
                  <span className="fa fa-fw fa-close" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {updatedForm.bridgeModel.qualifications.size === 0 && (
          <tr>
            <td colSpan="4" className="text-center">
              <I18n>No qualifications.</I18n>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const QualificationModal = ({
  updatedForm,
  handleBridgeChange,
  newQualification,
  setNewQualification,
}) =>
  !!newQualification && (
    <Modal
      size="lg"
      isOpen={!!newQualification}
      toggle={() => setNewQualification(null)}
    >
      <div className="modal-header">
        <h4 className="modal-title">
          <button
            onClick={() => setNewQualification(null)}
            type="button"
            className="btn btn-link"
          >
            <I18n>Cancel</I18n>
          </button>
          <span>
            <I18n>
              {newQualification.index !== null ? 'Edit' : 'Add'} Qualification
            </I18n>
          </span>
        </h4>
      </div>
      <div className="modal-body">
        <div className="modal-form">
          <div className="form-group required">
            <label htmlFor="name">
              <I18n>Qualification Name</I18n>
            </label>
            <input
              id="name"
              name="name"
              onChange={e =>
                setNewQualification(
                  newQualification.set('name', e.target.value),
                )
              }
              onBlur={e =>
                setNewQualification(
                  newQualification.set('name', e.target.value.trim()),
                )
              }
              value={newQualification.name}
              className="form-control"
            />
          </div>
          <div className="form-group required">
            <label htmlFor="resultType">
              <I18n>Result Type</I18n>
            </label>
            <I18n
              render={translate => (
                <select
                  id="resultType"
                  name="resultType"
                  onChange={e =>
                    setNewQualification(
                      newQualification.set('resultType', e.target.value),
                    )
                  }
                  value={newQualification.resultType}
                  className="form-control"
                >
                  <option value="Multiple">{translate('Multiple')}</option>
                  <option value="Single">{translate('Single')}</option>
                </select>
              )}
            />
          </div>
          <div className="form-group">
            <label>
              <I18n>Parameters</I18n>
            </label>
            <table className="table table--settings">
              <thead>
                <tr className="header">
                  <th scope="col">
                    <I18n>Name</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Notes</I18n>
                  </th>
                  <th width="1%" />
                </tr>
              </thead>
              <tbody>
                {newQualification.parameters.map((parameter, index) => (
                  <tr key={parameter.name}>
                    <td>{parameter.name}</td>
                    <td>{parameter.notes}</td>
                    <td className="text-right">
                      <div className="btn-group btn-group-sm pull-right">
                        <button
                          className="btn btn-danger"
                          onClick={e =>
                            setNewQualification(
                              newQualification.deleteIn(['parameters', index]),
                            )
                          }
                        >
                          <span className="fa fa-fw fa-close" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {newQualification.parameters.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      <I18n>No parameters.</I18n>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                {newQualification.newParameterError && (
                  <tr className="alert alert-danger" role="alert">
                    <td colSpan="3">
                      <I18n>{newQualification.newParameterError}</I18n>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <input
                      id="newParameterName"
                      name="newParameterName"
                      onChange={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterName',
                            e.target.value,
                          ),
                        )
                      }
                      onBlur={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterName',
                            e.target.value.trim(),
                          ),
                        )
                      }
                      value={newQualification.newParameterName}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      id="newParameterNotes"
                      name="newParameterNotes"
                      onChange={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterNotes',
                            e.target.value,
                          ),
                        )
                      }
                      onBlur={e =>
                        setNewQualification(
                          newQualification.set(
                            'newParameterNotes',
                            e.target.value.trim(),
                          ),
                        )
                      }
                      value={newQualification.newParameterNotes}
                      className="form-control"
                    />
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (
                          newQualification.parameters.find(
                            param =>
                              param.name === newQualification.newParameterName,
                          )
                        ) {
                          setNewQualification(
                            newQualification.set(
                              'newParameterError',
                              'A parameter with that name already exists.',
                            ),
                          );
                        } else {
                          setNewQualification(
                            newQualification
                              .update('parameters', parameters => [
                                ...parameters,
                                {
                                  name: newQualification.newParameterName,
                                  notes: newQualification.newParameterNotes,
                                },
                              ])
                              .set('newParameterName', '')
                              .set('newParameterNotes', '')
                              .set('newParameterError', null),
                          );
                        }
                      }}
                      disabled={isBlank(newQualification.newParameterName)}
                    >
                      <I18n>Add</I18n>
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="form-group">
            <label htmlFor="name">
              <I18n>Query</I18n>
            </label>
            <textarea
              id="query"
              name="query"
              onChange={e =>
                setNewQualification(
                  newQualification.set('query', e.target.value),
                )
              }
              value={newQualification.query}
              className="form-control"
              rows="3"
            />
          </div>
          {newQualification.error && (
            <div className="alert alert-danger">
              <I18n>{newQualification.error}</I18n>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            disabled={isBlank(newQualification.name)}
            onClick={() => {
              if (
                updatedForm.bridgeModel.qualifications.find(
                  (qual, index) =>
                    qual.name === newQualification.name &&
                    index !== newQualification.index,
                )
              ) {
                setNewQualification(
                  newQualification.set(
                    'error',
                    'A qualification with that name already exists.',
                  ),
                );
              } else {
                handleBridgeChange('bridgeQualification', newQualification);
                setNewQualification(null);
              }
            }}
            type="button"
            className="btn btn-primary"
          >
            <I18n>Save</I18n>
          </button>
        </div>
      </div>
    </Modal>
  );

const AttributeTable = ({
  updatedForm,
  editAttribute,
  setEditAttribute,
  newAttribute,
  setNewAttribute,
  handleBridgeChange,
  generateAttributes,
  canGenerateAttributes,
}) => (
  <div>
    <div className="table-title">
      <div className="table-title__wrapper">
        <div>
          <I18n>Bridge Attributes</I18n>
        </div>
      </div>
      <div className="table-title__actions">
        {canGenerateAttributes() && (
          <button
            onClick={() => generateAttributes()}
            className="btn btn-primary pull-right"
          >
            <I18n>Generate from Fields</I18n>
          </button>
        )}
      </div>
    </div>
    <table className="table table--settings">
      <thead>
        <tr className="header">
          <th scope="col">
            <I18n>Attribute Name</I18n>
          </th>
          <th scope="col">
            <I18n>Mapping</I18n>
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {updatedForm.bridgeModel.attributes.map((attr, index) => {
          const attrMapping =
            updatedForm.bridgeModelMapping.attributes.find(
              mapAttr => mapAttr.name === attr.name,
            ) || {};
          return (
            <tr key={attr.name}>
              <td>
                {editAttribute.index === index ? (
                  <input
                    id="editAttributeName"
                    name="editAttributeName"
                    onChange={e =>
                      setEditAttribute(
                        editAttribute.set('name', e.target.value),
                      )
                    }
                    onBlur={e =>
                      setEditAttribute(
                        editAttribute.set('name', e.target.value.trim()),
                      )
                    }
                    value={editAttribute.name}
                    className="form-control"
                  />
                ) : (
                  attr.name
                )}
              </td>
              <td>
                {editAttribute.index === index ? (
                  <input
                    id="editAttributeStructureField"
                    name="editAttributeStructureField"
                    onChange={e =>
                      setEditAttribute(
                        editAttribute.set('structureField', e.target.value),
                      )
                    }
                    onBlur={e =>
                      setEditAttribute(
                        editAttribute.set(
                          'structureField',
                          e.target.value.trim(),
                        ),
                      )
                    }
                    value={editAttribute.structureField}
                    className="form-control"
                  />
                ) : (
                  attrMapping.structureField || (
                    <em className="text-muted">
                      <I18n>No Mapping</I18n>
                    </em>
                  )
                )}
              </td>
              <td>
                {editAttribute.index === index ? (
                  <div className="btn-group btn-group-sm pull-right">
                    <button
                      className="btn btn-danger"
                      onClick={() => setEditAttribute(new BridgeAttribute())}
                    >
                      <span className="fa fa-fw fa-close" />
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleBridgeChange('bridgeAttribute', editAttribute);
                        setEditAttribute(new BridgeAttribute());
                      }}
                    >
                      <span className="fa fa-fw fa-check" />
                    </button>
                  </div>
                ) : (
                  <div className="btn-group btn-group-sm pull-right">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        setEditAttribute(
                          BridgeAttribute(attr)
                            .merge(attrMapping)
                            .set('index', index),
                        )
                      }
                    >
                      <span className="fa fa-fw fa-pencil" />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleBridgeChange('bridgeAttributeDelete', index)
                      }
                    >
                      <span className="fa fa-fw fa-close" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
        {updatedForm.bridgeModel.attributes.size === 0 && (
          <tr>
            <td colSpan="3" className="text-center">
              <I18n>No attributes.</I18n>
            </td>
          </tr>
        )}
      </tbody>
      <tfoot>
        {newAttribute.error && (
          <tr className="alert alert-danger" role="alert">
            <td colSpan="3">
              <I18n>{newAttribute.error}</I18n>
            </td>
          </tr>
        )}
        <tr>
          <td>
            <input
              id="newAttributeName"
              name="newAttributeName"
              onChange={e =>
                setNewAttribute(newAttribute.set('name', e.target.value))
              }
              onBlur={e =>
                setNewAttribute(newAttribute.set('name', e.target.value.trim()))
              }
              value={newAttribute.name}
              className="form-control"
            />
          </td>
          <td>
            <input
              id="newAttributeStructureField"
              name="newAttributeStructureField"
              onChange={e =>
                setNewAttribute(
                  newAttribute.set('structureField', e.target.value),
                )
              }
              onBlur={e =>
                setNewAttribute(
                  newAttribute.set('structureField', e.target.value.trim()),
                )
              }
              value={newAttribute.structureField}
              className="form-control"
            />
          </td>
          <td className="text-right">
            <button
              className="btn btn-danger"
              onClick={() => {
                if (
                  updatedForm.bridgeModel.attributes.find(
                    attr => attr.name === newAttribute.name,
                  )
                ) {
                  setNewAttribute(
                    newAttribute.set(
                      'error',
                      'An attribute with that name already exists.',
                    ),
                  );
                } else {
                  handleBridgeChange('bridgeAttribute', newAttribute);
                  setNewAttribute(new BridgeAttribute());
                }
              }}
              disabled={isBlank(newAttribute.name)}
            >
              <I18n>Add</I18n>
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
);

const handleColumnChange = ({ setFormChanges, updatedForm: { columns } }) => (
  index,
  prop,
  value,
) => {
  const updated = columns.setIn([index, prop], value);
  setFormChanges({ type: 'columns', value: updated });
};

const handleColumnOrderChange = ({
  setFormChanges,
  updatedForm: { columns },
}) => ({ source, destination }) => {
  if (destination && source.index !== destination.index) {
    const updated = columns.update(cols => {
      const col = cols.get(source.index);
      return cols.delete(source.index).insert(destination.index, col);
    });
    setFormChanges({ type: 'columns', value: updated });
  }
};

const handleBridgeChange = ({
  setFormChanges,
  updatedForm: { bridgeModel, bridgeModelMapping },
}) => (type, value) => {
  if (type === 'bridgeName') {
    setFormChanges({ type: 'bridgeName', value });
    setFormChanges({
      type: 'bridgeModelMapping',
      value: bridgeModelMapping.set('bridgeName', value),
    });
  } else if (type === 'formName') {
    if (bridgeModel.name) {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.set('name', `Datastore - ${value}`),
      });
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.set('name', `Datastore - ${value}`),
      });
    }
  } else if (type === 'bridgeQualification') {
    if (value.index === null) {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.update('qualifications', quals =>
          quals.push(BridgeModelQualification(value)),
        ),
      });
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.update('qualifications', quals =>
          quals.push(BridgeModelMappingQualification(value)),
        ),
      });
    } else {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.setIn(
          ['qualifications', value.index],
          BridgeModelQualification(value),
        ),
      });
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.setIn(
          ['qualifications', value.index],
          BridgeModelMappingQualification(value),
        ),
      });
    }
  } else if (type === 'bridgeQualificationDelete') {
    setFormChanges({
      type: 'bridgeModel',
      value: bridgeModel.deleteIn(['qualifications', value]),
    });
    setFormChanges({
      type: 'bridgeModelMapping',
      value: bridgeModelMapping.deleteIn(['qualifications', value]),
    });
  } else if (type === 'bridgeAttribute') {
    if (value.index === null) {
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.update('attributes', quals =>
          quals.push({ name: value.name }),
        ),
      });
      !isBlank(value.structureField) &&
        setFormChanges({
          type: 'bridgeModelMapping',
          value: bridgeModelMapping.update('attributes', quals =>
            quals.push({
              name: value.name,
              structureField: value.structureField,
            }),
          ),
        });
    } else {
      const attr = bridgeModel.getIn(['attributes', value.index]);
      const attrMapping = bridgeModelMapping.attributes.find(
        mapAttr => mapAttr.name === attr.name,
      );
      setFormChanges({
        type: 'bridgeModel',
        value: bridgeModel.setIn(['attributes', value.index], {
          name: value.name,
        }),
      });
      if (attrMapping) {
        const index = bridgeModelMapping.attributes.indexOf(attrMapping);
        if (!isBlank(value.structureField)) {
          setFormChanges({
            type: 'bridgeModelMapping',
            value: bridgeModelMapping.setIn(['attributes', index], {
              name: value.name,
              structureField: value.structureField,
            }),
          });
        } else {
          setFormChanges({
            type: 'bridgeModelMapping',
            value: bridgeModelMapping.deleteIn(['attributes', index]),
          });
        }
      } else if (!isBlank(value.structureField)) {
        setFormChanges({
          type: 'bridgeModelMapping',
          value: bridgeModelMapping.update('attributes', quals =>
            quals.push({
              name: value.name,
              structureField: value.structureField,
            }),
          ),
        });
      }
    }
  } else if (type === 'bridgeAttributeDelete') {
    const attr = bridgeModel.getIn(['attributes', value]);
    const attrMapping = bridgeModelMapping.attributes.find(
      mapAttr => mapAttr.name === attr.name,
    );
    setFormChanges({
      type: 'bridgeModel',
      value: bridgeModel.deleteIn(['attributes', value]),
    });
    if (attrMapping) {
      const index = bridgeModelMapping.attributes.indexOf(attrMapping);
      setFormChanges({
        type: 'bridgeModelMapping',
        value: bridgeModelMapping.deleteIn(['attributes', index]),
      });
    }
  }
};

const handleFormChange = ({ setFormChanges }) => (type, value) => {
  setFormChanges({ type, value });
};

const handleSave = ({ updateForm }) => () => () => {
  updateForm();
};

const handleReset = ({ resetForm }) => () => () => {
  resetForm();
};

const generateAttributes = ({
  updatedForm: { columns, bridgeModel, bridgeModelMapping },
  setFormChanges,
}) => () => {
  let updatedBridgeModel = bridgeModel;
  let updatedBridgeModelMapping = bridgeModelMapping;
  columns.forEach(column => {
    if (
      column.type === 'value' &&
      !bridgeModel.attributes.find(a => a.name === column.name)
    ) {
      updatedBridgeModel = updatedBridgeModel.update('attributes', quals =>
        quals.push({ name: column.name }),
      );
      updatedBridgeModelMapping = updatedBridgeModelMapping.update(
        'attributes',
        quals =>
          quals.push({
            name: column.name,
            structureField: `\${fields('values[${column.name}]')}`,
          }),
      );
    }
  });
  if (!bridgeModel.attributes.find(a => a.name === 'Id')) {
    updatedBridgeModel = updatedBridgeModel.update('attributes', quals =>
      quals.push({ name: 'Id' }),
    );
    updatedBridgeModelMapping = updatedBridgeModelMapping.update(
      'attributes',
      quals =>
        quals.push({
          name: 'Id',
          structureField: `\${fields('values[id]')}`,
        }),
    );
  }
  setFormChanges({
    type: 'bridgeModel',
    value: updatedBridgeModel,
  });
  setFormChanges({
    type: 'bridgeModelMapping',
    value: updatedBridgeModelMapping,
  });
};

const canGenerateAttributes = ({
  updatedForm: { columns, bridgeModel },
}) => () => {
  const missing = columns.find(
    column =>
      column.type === 'value' &&
      !bridgeModel.attributes.find(a => a.name === column.name),
  );
  return missing || !bridgeModel.attributes.find(a => a.name === 'Id');
};

const windowFocusListener = ({ setStaleFields, origForm }) => () => {
  // Check if form fields are stale, and if yes, allow user to reload form
  axios
    .get(`${bundle.apiLocation()}/datastore/forms/${origForm.slug}`, {
      params: { include: 'fields' },
    })
    .then(response => ({ form: response.data.form }))
    .then(({ form }) => {
      if (
        !List(origForm.fields)
          .map(({ name }) => name)
          .sort()
          .equals(
            List(form.fields)
              .map(({ name }) => name)
              .sort(),
          )
      ) {
        setStaleFields(true);
      }
    })
    .catch(() => {
      /* Do nothing if form fetch errors */
    });
};

export const mapStateToProps = (state, { slug }) => ({
  loading: state.settingsDatastore.currentFormLoading,
  canManage: state.settingsDatastore.currentForm.canManage,
  origForm: state.settingsDatastore.currentForm,
  updatedForm: state.settingsDatastore.currentFormChanges,
  formSlug: slug,
  hasChanged: !state.settingsDatastore.currentForm.equals(
    state.settingsDatastore.currentFormChanges,
  ),
  bridges: state.settingsDatastore.bridges,
  bridgeName: '',
});

export const mapDispatchToProps = {
  push,
  fetchForm: actions.fetchForm,
  setFormChanges: actions.setFormChanges,
  updateForm: actions.updateForm,
  resetForm: actions.resetForm,
};

export const DatastoreSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('newQualification', 'setNewQualification', null),
  withState('newAttribute', 'setNewAttribute', new BridgeAttribute()),
  withState('editAttribute', 'setEditAttribute', new BridgeAttribute()),
  withState('staleFields', 'setStaleFields', false),
  withHandlers({
    handleBridgeChange,
    handleColumnChange,
    handleColumnOrderChange,
    handleFormChange,
    handleSave,
    handleReset,
    windowFocusListener,
  }),
  withHandlers({
    canGenerateAttributes,
    generateAttributes,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.formSlug);
      window.addEventListener('focus', this.props.windowFocusListener);
    },
    componentWillUnmount() {
      window.removeEventListener('focus', this.props.windowFocusListener);
    },
  }),
)(SettingsComponent);
