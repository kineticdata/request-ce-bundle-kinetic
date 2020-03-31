import React from 'react';
import { Link } from 'react-router-dom';
import { UserTable, I18n } from '@kineticdata/react';
import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { PageTitle } from '../shared/PageTitle';
import { Avatar } from 'common';
// import papaparse from 'papaparse';
// import { fromJS } from 'immutable';
// import downloadjs from 'downloadjs';

// const IsJsonString = str => {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// };

// const handleImport = props => () => {
//   const file = this.fileEl.files[0];
//   const extention = file.name.split('.')[file.name.split('.').length - 1];

//   if (file && extention === 'csv') {
//     const reader = new FileReader();
//     reader.readAsText(this.fileEl.files[0]);
//     reader.onload = event => {
//       papaparse.parse(event.target.result, {
//         header: true,
//         dynamicTyping: true,
//         complete: results => {
//           // When streaming, parse results are not available in this callback.
//           if (results.errors.length <= 0) {
//             const { users, updateUser, createUser } = props;
//             const importedUsers = fromJS(results.data)
//               .map(user => {
//                 return user
//                   .update('allowedIps', val => (val ? val : ''))
//                   .update(
//                     'attributesMap',
//                     val => (IsJsonString(val) ? fromJS(JSON.parse(val)) : {}),
//                   )
//                   .update(
//                     'profileAttributesMap',
//                     val => (IsJsonString(val) ? fromJS(JSON.parse(val)) : {}),
//                   )
//                   .update(
//                     'memberships',
//                     val => (IsJsonString(val) ? fromJS(JSON.parse(val)) : {}),
//                   );
//               })
//               .toSet();
//             const existingUsers = fromJS(
//               users.map(user => ({
//                 ...user,
//                 memberships: user.memberships.reduce((acc, membership) => {
//                   const team = { team: { name: membership.team.name } };
//                   acc.push(team);
//                   return acc;
//                 }, []),
//               })),
//             ).toSet();
//             const userdiff = importedUsers.subtract(existingUsers);
//             userdiff.forEach(user => {
//               const found = existingUsers.find(
//                 existingUser =>
//                   user.get('username') === existingUser.get('username'),
//               );
//               if (found) {
//                 updateUser(user.toJS());
//               } else {
//                 createUser(user.toJS());
//               }
//             });
//           } else {
//             console.log(results.errors);
//           }
//         },
//       });
//     };
//   }
// };

// const handleExport = props => {
//   downloadjs(props.data, 'user.csv', 'text/csv');
// };

const AvatarCell = ({ row }) => (
  <td>
    <Avatar username={row.get('username')} size={18} />
  </td>
);

const NameCell = ({ value, row }) => (
  <td>
    <Link to={`/settings/users/${row.get('username')}/edit`} title="Edit User">
      {value}
    </Link>
  </td>
);

const ActionsCell = ({ row }) => (
  <td className="text-right" style={{ width: '1%' }}>
    <UncontrolledDropdown className="more-actions">
      <DropdownToggle tag="button" className="btn btn-sm btn-link">
        <span className="fa fa-chevron-down fa-fw" />
      </DropdownToggle>
      <DropdownMenu right>
        <Link to={`/profile/${row.get('username')}`} className="dropdown-item">
          <I18n>View</I18n>
        </Link>
        <Link
          to={`/settings/users/${row.get('username')}/edit`}
          className="dropdown-item"
        >
          <I18n>Edit</I18n>
        </Link>
        {/* <Link
          to={`/settings/users/${row.get('username')}/clone`}
          className="dropdown-item"
        >
          <I18n>Clone</I18n>
        </Link> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  </td>
);

const EmptyBodyRow = generateEmptyBodyRow({
  loadingMessage: 'Loading Users...',
  noSearchResultsMessage:
    'No Users were found - please modify your search criteria',
  noItemsMessage: 'There are no Users to display.',
  noItemsLinkTo: '/settings/users/new',
  noItemsLinkToMessage: 'Add new User',
});

const FilterLayout = generateFilterModalLayout([
  'username',
  'displayName',
  'email',
]);

export const UsersList = ({ tableType }) => (
  <UserTable
    // tableKey={tableKey}
    components={{
      FilterLayout,
      EmptyBodyRow,
      TableLayout: SettingsTableLayout,
    }}
    alterColumns={{
      username: {
        components: {
          BodyCell: NameCell,
        },
      },
    }}
    addColumns={[
      {
        value: 'avatar',
        title: ' ',
        sortable: false,
        components: {
          BodyCell: AvatarCell,
        },
      },
      {
        value: 'actions',
        title: ' ',
        sortable: false,
        components: {
          BodyCell: ActionsCell,
        },
      },
    ]}
    columnSet={['avatar', 'username', 'displayName', 'email', 'actions']}
  >
    {({ pagination, table, filter }) => (
      <div className="page-container">
        <PageTitle parts={['Users']} />
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../settings">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                <I18n>Users</I18n>
              </h1>
            </div>
            <div className="page-title__actions">
              {/* <input
                type="file"
                accept=".csv"
                id="file-input"
                style={{ display: 'none' }}
                onChange={handleImport}
                ref={element => {
                  this.fileEl = element;
                }}
              />
              <label
                htmlFor="file-input"
                className="btn btn-info"
                style={{ marginBottom: '0px' }}
              >
                <I18n>Import Users</I18n>
              </label> */}
              {/* <button className="btn btn-secondary" onClick={handleExport}>
                <I18n>Export Users</I18n>
              </button> */}
              <Link to="../settings/users/new">
                <I18n
                  render={translate => (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      title={translate('New User')}
                    >
                      <span className="fa fa-plus fa-fw" />{' '}
                      {translate('New User')}
                    </button>
                  )}
                />
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-2 text-right">{filter}</div>
            {table}
            {pagination}
          </div>
        </div>
      </div>
    )}
  </UserTable>
);
