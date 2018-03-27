import { Record } from 'immutable';

// Used in datastore to define a single column
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
