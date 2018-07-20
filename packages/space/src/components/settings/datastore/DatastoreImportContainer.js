import { connect } from 'react-redux';

import { actions } from '../../../redux/modules/settingsDatastore';

import { DatastoreImport } from './DatastoreImport';

export const mapStateToProps = state => {
  const headerToFieldMapFormAttribute =
    state.space.settingsDatastore.currentForm.attributesMap[
      'CSV Header To Form Map'
    ];
  return {
    spaceAdmin: state.app.profile.spaceAdmin,
    headerToFieldMapDefinitionExists:
      state.app.space.datastoreFormAttributeDefinitions.find(
        definition => definition.name === 'CSV Header To Form Map',
      ) !== undefined,
    canManage: state.space.settingsDatastore.currentForm.canManage,
    formFields: state.space.settingsDatastore.currentForm.fields.reduce(
      (acc, field) => {
        acc.push(field.name);
        return acc;
      },
      [],
    ),
    headerToFieldMapFormAttributeExists:
      headerToFieldMapFormAttribute !== undefined &&
      headerToFieldMapFormAttribute[0] !== undefined,
    headerToFieldMapFormAttribute:
      headerToFieldMapFormAttribute !== undefined &&
      headerToFieldMapFormAttribute[0] !== undefined &&
      JSON.parse(headerToFieldMapFormAttribute[0]),
  };
};

export const mapDispatchToProps = {
  fetchForm: actions.fetchForm,
  updateForm: actions.updateFormAttributesMap,
  updateHeaderToFieldMap: actions.updateHeaderToFieldMap,
};

export const DatastoreImportContianer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DatastoreImport);
