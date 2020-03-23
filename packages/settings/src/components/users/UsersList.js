import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { deleteUser, UserTable, refetchTable, I18n } from '@kineticdata/react';
import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { PageTitle } from '../shared/PageTitle';

const tableKey = `users-list`;

const userDeleteConfirmOptions = {
  title: 'Are you sure you want to delete this User?',
  body:
    'Deleting a user is a permanent action. Are you sure you want to continue?',
  actionName: 'Delete User',
  actionType: 'danger',
};

const FilterLayout = generateFilterModalLayout([
  'username',
  'displayName',
  'email',
]);

const ActionsCell = ({ row }) => (
  <td className="text-right" style={{ width: '1%' }}>
    <UncontrolledDropdown className="more-actions">
      <DropdownToggle tag="button" className="btn btn-sm btn-link">
        <span className="fa fa-chevron-down fa-fw" />
      </DropdownToggle>
      <DropdownMenu right>
        {/* <Link to={row.get('slug')} className="dropdown-item">
          <I18n>View</I18n>
        </Link> */}
        {/* {({ actions, anyPending, pending }) => (
          <div className="btn-group pull-right">
            <Link
              className={`btn btn-xs btn-secondary ${
                anyPending ? 'link-disabled' : ''
              }`}
              to={`/space/users-teams/users/edit/${props.row.get('username')}`}
            >
              <span className="fa fa-pencil fa-fw" />
            </Link>
            <button
              type="button"
              className="btn btn-xs btn-danger"
              disabled={anyPending}
              onClick={actions.delete(props.row.get('username'))}
            >
              {pending.get('delete') ? (
                <span className="fa fa-spin fa-fw fa-spinner" />
              ) : (
                <span className="fa fa-remove fa-fw" />
              )}
            </button>
          </div>
        )} */}
      </DropdownMenu>
    </UncontrolledDropdown>
  </td>
);

const EmptyBodyRow = generateEmptyBodyRow({
  loadingMessage: 'Loading Users...',
  noSearchResultsMessage:
    'No Users were found - please modify your search criteria',
  noItemsMessage: 'There are no Users to display.',
  noItemsLinkTo: '/space/users-teams/users/new',
  noItemsLinkToMessage: 'Add new User',
});

const NameCell = ({ value, row }) => (
  <td>
    <Link
      to={`/space/users-teams/users/edit/${row.get('username')}`}
      title="Edit User"
    >
      {value}
    </Link>
  </td>
);

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
        value: 'actions',
        title: 'actions',
        sortable: false,
        components: {
          BodyCell: ActionsCell,
        },
      },
    ]}
    columnSet={['username', 'displayName', 'email', 'actions']}
  >
    {({ pagination, table, filter }) => (
      <div className="page-container page-container--panels">
        <PageTitle parts={['Users']} />
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                <I18n>Users</I18n>
              </h1>
            </div>
            <div className="page-title__actions">
              <Link to="new">
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
        {/* <div className="page-panel page-panel--one-thirds page-panel--sidebar">
          <h3>
            <I18n>Datastore Forms</I18n>
          </h3>
          <p>
            <I18n>
              Datastore Forms allow administrators to define and build
              referential datasets. These forms can be configured with compound
              (multi-field/property) indexes and unique indexes, which provide
              efficient query support for large datasets.
            </I18n>
          </p>
          <p>
            <I18n>
              Example datasets: Assets, People, Locations, Vendors, or Cities
              and States
            </I18n>
          </p>
        </div> */}
      </div>
    )}
  </UserTable>
);

//
//
//
//
//
//
//
//
//
//
//
//

// import React from 'react';
// import { Link } from '@reach/router';
// import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
// import { I18n, UserTable } from '@kineticdata/react';
// import { PageTitle } from '../shared/PageTitle';
// import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
// import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
// import { TimeAgoCell } from 'common/src/components/tables/TimeAgoCell';
// import { StatusBadgeCell } from 'common/src/components/tables/StatusBadgeCell';
// import { SelectFilter } from 'common/src/components/tables/SelectFilter';
// import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';

// const ActionsCell = () => ({ row }) => (
//   <td className="text-right" style={{ width: '1%' }}>
//     <UncontrolledDropdown className="more-actions">
//       <DropdownToggle tag="button" className="btn btn-sm btn-link">
//         <span className="fa fa-chevron-down fa-fw" />
//       </DropdownToggle>
//       <DropdownMenu right>
//         <Link to={row.get('slug')} className="dropdown-item">
//           <I18n>View</I18n>
//         </Link>
//         <Link to={`${row.get('slug')}/new`} className="dropdown-item">
//           <I18n>New Record</I18n>
//         </Link>
//         <Link to={`${row.get('slug')}/settings`} className="dropdown-item">
//           <I18n>Configure</I18n>
//         </Link>
//       </DropdownMenu>
//     </UncontrolledDropdown>
//   </td>
// );

// const FormNameCell = ({ row, value }) => (
//   <td>
//     <Link to={row.get('slug')}>{value}</Link>
//     <br />
//     <small>{row.get('slug')}</small>
//   </td>
// );

// const FilterLayout = generateFilterModalLayout(
//   ['name', 'status'],
//   'Filter Forms',
// );

// const EmptyBodyRow = generateEmptyBodyRow({
//   loadingMessage: 'Loading Datastore Forms...',
//   noSearchResultsMessage:
//     'No datastore forms were found - please modify your search criteria',
//   noItemsMessage: 'There are no datastore forms to display.',
//   noItemsLinkTo: `/settings/datastore/new`,
//   noItemsLinkToMessage: 'Add New Datastore Form',
// });

// export const UsersList = () => (
//   <UserTable
//     datastore
//     components={{
//       EmptyBodyRow,
//       FilterLayout,
//       TableLayout: SettingsTableLayout,
//     }}
//     columnSet={['name', 'status', 'updatedAt', 'actions']}
//     addColumns={[
//       {
//         value: 'actions',
//         title: ' ',
//         sortable: false,
//         components: {
//           BodyCell: ActionsCell(),
//         },
//         className: 'text-right',
//       },
//     ]}
//     alterColumns={{
//       updatedAt: {
//         components: {
//           BodyCell: TimeAgoCell,
//         },
//       },
//       name: {
//         components: {
//           BodyCell: FormNameCell,
//         },
//       },
//       status: {
//         components: {
//           BodyCell: StatusBadgeCell,
//           Filter: SelectFilter,
//         },
//       },
//     }}
//   >
//     {({ pagination, table, filter, tableKey }) => (
//       <div className="page-container page-container--panels">
//         <PageTitle parts={['Datastore Forms']} />
//         <div className="page-panel page-panel--two-thirds page-panel--white">
//           <div className="page-title">
//             <div className="page-title__wrapper">
//               <h3>
//                 <Link to="../">
//                   <I18n>settings</I18n>
//                 </Link>{' '}
//                 /{` `}
//               </h3>
//               <h1>
//                 <I18n>Datastore Forms</I18n>
//               </h1>
//             </div>
//             <div className="page-title__actions">
//               <Link to="new">
//                 <I18n
//                   render={translate => (
//                     <button
//                       type="button"
//                       className="btn btn-secondary"
//                       title={translate('New Datastore Form')}
//                     >
//                       <span className="fa fa-plus fa-fw" />{' '}
//                       {translate('New Datastore Form')}
//                     </button>
//                   )}
//                 />
//               </Link>
//             </div>
//           </div>
//           <div>
//             <div className="mb-2 text-right">{filter}</div>
//             {table}
//             {pagination}
//           </div>
//         </div>
//         <div className="page-panel page-panel--one-thirds page-panel--sidebar">
//           <h3>
//             <I18n>Datastore Forms</I18n>
//           </h3>
//           {/* TODO: Update tone of copy */}
//           <p>
//             <I18n>
//               Datastore Forms allow administrators to define and build
//               referential datasets. These forms can be configured with compound
//               (multi-field/property) indexes and unique indexes, which provide
//               efficient query support for large datasets.
//             </I18n>
//           </p>
//           <p>
//             <I18n>
//               Example datasets: Assets, People, Locations, Vendors, or Cities
//               and States
//             </I18n>
//           </p>
//         </div>
//       </div>
//     )}
//   </UserTable>
// );

//
//
//
//
//
//
//
//
//
//

// import React from 'react';
// import { Link } from '@reach/router';
// import { connect } from 'react-redux';
// import { push } from 'redux-first-history';
// import { compose, lifecycle, withHandlers, withState } from 'recompose';
// import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
// import papaparse from 'papaparse';
// import { fromJS } from 'immutable';
// import downloadjs from 'downloadjs';
// import { PageTitle } from '../shared/PageTitle';

// import { actions } from '../../redux/modules/settingsUsers';
// import { context } from '../../redux/store';

// import { UsersListItem } from './UsersListItem';
// import { I18n } from '@kineticdata/react';

// const IsJsonString = str => {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// };

// const WallyEmptyMessage = ({ filter }) => {
//   return (
//     <div className="empty-state empty-state--wally">
//       <h5>
//         <I18n>No Users Found</I18n>
//       </h5>
//       <img src={wallyHappyImage} alt="Happy Wally" />
//       <h6>
//         <I18n>Click Create User to add a new user</I18n>
//       </h6>
//     </div>
//   );
// };

// const UsersListComponent = ({
//   users,
//   loading,
//   handleChange,
//   handleDownload,
// }) => {
//   return (
//     <div className="page-container">
//       <PageTitle parts={['Users', 'Settings']} />
//       <div className="page-panel page-panel--white">
//         <div className="page-title">
//           <div className="page-title__wrapper">
//             <h3>
//               <Link to="/settings">
//                 <I18n>settings</I18n>
//               </Link>{' '}
//               /{` `}
//             </h3>
//             <h1>
//               <I18n>Users</I18n>
//             </h1>
//           </div>
//           <div className="page-title__actions">
//             <input
//               type="file"
//               accept=".csv"
//               id="file-input"
//               style={{ display: 'none' }}
//               onChange={handleChange}
//               ref={element => {
//                 this.fileEl = element;
//               }}
//             />
//             <label
//               htmlFor="file-input"
//               className="btn btn-info"
//               style={{ marginBottom: '0px' }}
//             >
//               <I18n>Import Users</I18n>
//             </label>
//             <button className="btn btn-secondary" onClick={handleDownload}>
//               <I18n>Export Users</I18n>
//             </button>
//             <Link to="new" className="btn btn-primary">
//               <I18n>New User</I18n>
//             </Link>
//           </div>
//         </div>

//         <div>
//           {loading ? (
//             <h3>
//               <I18n>Loading</I18n>
//             </h3>
//           ) : users.length > 0 ? (
//             <div className="space-admin-wrapper">
//               <table className="table table--settings table-sm">
//                 <thead className="d-none d-md-table-header-group sortable">
//                   <tr className="header">
//                     <th className="sort-disabled" />
//                     <th scope="col">
//                       <I18n>Username</I18n>
//                     </th>
//                     <th scope="col">
//                       <I18n>Display Name</I18n>
//                     </th>
//                     <th scope="col">
//                       <I18n>Email</I18n>
//                     </th>
//                     <th className="sort-disabled" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(user => (
//                     <UsersListItem key={user.username} user={user} />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <WallyEmptyMessage />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const createCSV = users => {
//   let csv = papaparse.unparse(
//     users.reduce((acc, user) => {
//       acc.push({
//         ...user,
//         attributesMap: JSON.stringify(user.attributesMap),
//         memberships: JSON.stringify(
//           // Remove the slugs from the teams prior to export.
//           user.memberships.reduce((acc, membership) => {
//             const team = { team: { name: membership.team.name } };
//             acc.push(team);
//             return acc;
//           }, []),
//         ),
//         profileAttributesMap: JSON.stringify(user.profileAttributesMap),
//       });
//       return acc;
//     }, []),
//   );
//   return csv;
// };

// const handleChange = props => () => {
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

// export const handleDownload = props => () => {
//   downloadjs(props.data, 'user.csv', 'text/csv');
// };

// export const mapStateToProps = state => ({
//   loading: state.settingsUsers.loading,
//   users: state.settingsUsers.users,
// });

// export const mapDispatchToProps = {
//   push,
//   fetchUsers: actions.fetchUsers,
//   updateUser: actions.updateUser,
//   createUser: actions.createUser,
// };

// export const UsersList = compose(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//     null,
//     { context },
//   ),
//   withState('data', 'setData', ''),
//   withHandlers({ handleChange, handleDownload }),
//   lifecycle({
//     componentWillMount() {
//       this.props.fetchUsers();
//     },
//     componentWillReceiveProps(nextProps) {
//       if (this.props.users !== nextProps.users) {
//         nextProps.setData(createCSV(nextProps.users));
//       }
//     },
//   }),
// )(UsersListComponent);
