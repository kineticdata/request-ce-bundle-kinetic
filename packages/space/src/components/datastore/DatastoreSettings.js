import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import { bundle } from 'react-kinetic-core';

import { actions, selectCanManage } from '../../redux/modules/datastore';

const SettingsComponent = ({
  canManage,
  form,
  columns,
  handleColumnChange,
  loading,
  hasChanged,
  handleSave,
}) =>
  !loading && (
    <div className="datastore-container">
      <div className="datastore-content pane scrollable">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to={`/datastore/`}>datastore</Link> /{` `}
              <Link to={`/datastore/${form.slug}/`}>{form.name}</Link> /
            </h3>
            <h1>Configuration</h1>
          </div>
          {hasChanged && (
            <button
              type="button"
              onClick={handleSave()}
              className="btn btn-default"
            >
              Save Configuration
            </button>
          )}
          <a
            href={`${bundle.spaceLocation()}/app/#/admin/datastore/form/${
              form.slug
            }/builder`}
            className="btn btn-primary"
            target="blank"
          >
            Form Builder
          </a>
        </div>
        {canManage ? (
          <div className="datastore-settings">
            <h3 className="section-title">General Settings</h3>
            <div className="settings">
              <div className="form-row">
                <div className="col">
                  <div className="form-group required">
                    <label htmlFor="name">Datastore Name</label>
                    <input
                      id="name"
                      name="name"
                      onChange={e => console.log(e)}
                      value={form.name}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group required">
                    <label htmlFor="slug">Datastore Slug</label>
                    <input
                      id="slug"
                      name="slug"
                      onChange={e => console.log(e)}
                      value={form.slug}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="name">
                  Datastore Description <small>(optional)</small>
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  onChange={e => console.log(e)}
                  value={form.description}
                  rows="3"
                  name="description"
                />
              </div>
            </div>
            <div className="table-settings">
              <h3 className="section-title">Table Display Settings</h3>
              <div className="settings">
                <table className="table">
                  <thead>
                    <tr className="header">
                      <th>Field</th>
                      <th>Visible in Table</th>
                      <th>Filterable in Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns.filter(col => col.type === 'value').map(col => (
                      <tr key={col.name}>
                        <td>{col.label}</td>
                        <td>
                          <input
                            onChange={handleColumnChange(col, 'visible')}
                            type="checkbox"
                            checked={col.visible}
                          />
                        </td>
                        <td>
                          <input
                            onChange={handleColumnChange(col, 'filterable')}
                            type="checkbox"
                            checked={col.filterable}
                          />
                        </td>
                      </tr>
                    ))}
                    {columns.filter(col => col.type !== 'value').map(col => (
                      <tr key={col.name}>
                        <td>
                          <i>
                            {col.label} <small>(system field)</small>
                          </i>
                        </td>
                        <td>
                          <input
                            onChange={handleColumnChange(col, 'visible')}
                            type="checkbox"
                            checked={col.visible}
                          />
                        </td>
                        <td>
                          <input
                            onChange={handleColumnChange(col, 'filterable')}
                            type="checkbox"
                            checked={col.filterable}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="table-settings">
              <h3 className="section-title">Bridge Configuration</h3>
              <div className="settings">
                <div className="form-group">
                  <label htmlFor="name">Bridge Name</label>
                  <select
                    id="bridgeName"
                    name="bridgeName"
                    onChange={e => console.log(e)}
                    value={form.slug}
                    className="form-control"
                  >
                    <option />
                    {form.space.bridges.map(b => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>You do not have access to configure this datastore.</p>
        )}
      </div>
      <div className="datastore-sidebar">
        <h3>Datastore Configuration</h3>
        <p>
          To update the datastore form fields, click the Builder button, which
          will open the form builder in a new window. You will need to reload
          this page after making changes in the form builder, which can be done
          by clicking the reload button.
        </p>
        <h4>Table Display Options</h4>
        <p>
          The Display Table Options section lists all of the fields that exist
          in this datastore. The order in this table will determine the order
          the records appear in the Records table. You may order the table by
          dragging the rows. Visible: Should this field appear in the records
          table? Searchable: Should the data in this field be searchable in the
          records table? Sortable: Should the records table be sortable by this
          field? Unique: Should the data in this field be required to be unique
          for all records?
        </p>
      </div>
    </div>
  );

const handleColumnChange = ({ updateColumnsConfig, setHasChanged }) => (
  column,
  type,
) => () => {
  const updated = column.set(type, !column.get(type));
  setHasChanged(true);
  updateColumnsConfig({ original: column, updated });
};

const handleSave = () => () => () => {
  console.log('time to save');
};

export const mapStateToProps = (state, { match: { params } }) => ({
  loading: state.datastore.currentFormLoading,
  canManage: selectCanManage(state, params.slug),
  form: state.datastore.currentForm,
  columns: state.datastore.columnsConfig,
  formSlug: params.slug,
});

export const mapDispatchToProps = {
  push,
  fetchForm: actions.fetchForm,
  updateColumnsConfig: actions.updateColumnsConfig,
};

export const DatastoreSettings = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('hasChanged', 'setHasChanged', false),
  withHandlers({ handleColumnChange, handleSave }),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.formSlug);
    },
  }),
)(SettingsComponent);
