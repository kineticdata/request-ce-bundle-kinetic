import { Record, List } from 'immutable';

// Used in datastore to define a datastore form
export const DatastoreForm = Record({
  name: '',
  slug: '',
  description: '',
  indexDefinitions: List(),
  columns: List(),
  bridgeModelMapping: Record(),
  bridgeModel: Record(),
  bridge: '',
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
  // if the column is filterable in the table
  filterable: false,
});
