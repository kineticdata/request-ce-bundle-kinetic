import { Record, List } from 'immutable';

export const BridgeQualification = Record({
  name: '',
  parameters: [],
  resultType: 'Multiple',
  query: '',
  index: null,
  error: null,
  newParameterName: '',
  newParameterNotes: '',
  newParameterError: null,
});

export const BridgeAttribute = Record({
  name: '',
  structureField: '',
  index: null,
  error: null,
});

export const BridgeModelQualification = Record({
  name: '',
  parameters: [],
  resultType: 'Multiple',
});

export const BridgeModelMappingQualification = Record({
  name: '',
  query: '',
});

export const BridgeModelMapping = Record({
  attributes: List(),
  agentSlug: 'system',
  bridgeSlug: '',
  name: '',
  qualifications: List(),
  status: 'Active',
  structure: 'Datastore Submissions',
});

// Used in datastore to define a bridgemodel associated w/ a datastore form
export const BridgeModel = Record({
  activeMappingName: '',
  attributes: List(),
  mappings: List(),
  name: '',
  qualifications: List(),
  status: 'Active',
});

// Used in datastore to define a datastore form
export const DatastoreForm = Record({
  name: '',
  slug: '',
  description: '',
  indexDefinitions: List(),
  status: '',
  columns: List(),
  defaultSearchIndex: null,
  fields: [],
  canManage: false,
  isHidden: false,
  isSurvey: false,
  bridgeModel: BridgeModel(),
  bridgeModelMapping: BridgeModelMapping(),
  bridgeSlug: '',
  createdAt: '',
  updatedAt: '',
  closedAt: '',
  closedBy: '',
  createdBy: '',
  updatedBy: '',
});

// Used in datastore to define a datastore form for saving
export const DatastoreFormSave = Record({
  name: '',
  slug: '',
  description: '',
  attributesMap: {},
});

// Used in datastore to define configurations
export const DatastoreConfig = Record({
  // columns config
  columns: List(),
  // index for use in initial search
  defaultSearchIndex: { index: 'createdAt', direction: 'DESC' },
});

// Used in datastore to define a single table column
export const ColumnConfig = Record({
  // name of the column
  name: '',
  // lable of the column displayed in table
  label: '',
  // Valid types are: system, value.
  type: '',
  // if the column is displayable in the table
  visible: false,
});

export const SearchParams = Record({
  index: null,
  indexParts: List(),
});

export const IndexValues = Record({
  values: List(),
  input: '',
});

export const IndexPart = Record({
  name: '',
  operation: 'Starts With',
  value: IndexValues(),
});
