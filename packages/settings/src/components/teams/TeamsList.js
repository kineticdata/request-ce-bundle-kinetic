import React from 'react';
import { Link } from 'react-router-dom';
import { TeamTable, I18n } from '@kineticdata/react';
import { generateEmptyBodyRow } from 'common/src/components/tables/EmptyBodyRow';
import { generateFilterModalLayout } from 'common/src/components/tables/FilterLayout';
import { SettingsTableLayout } from 'common/src/components/tables/TableLayout';
import { PageTitle } from '../shared/PageTitle';

const NameCell = ({ value, row }) => (
  <td>
    <Link to={`/settings/teams/${row.get('slug')}/edit`} title="Edit Team">
      {value}
    </Link>
  </td>
);

const EmptyBodyRow = generateEmptyBodyRow({
  loadingMessage: 'Loading Teams...',
  noSearchResultsMessage:
    'No Teams were found - please modify your search criteria',
  noItemsMessage: 'There are no Teams to display.',
  noItemsLinkTo: '/space/users-teams/teams/new',
  noItemsLinkToMessage: 'Add new Team',
});

const FilterLayout = generateFilterModalLayout(['name']);

export const TeamsList = ({ tableType }) => (
  <TeamTable
    // tableKey={tableKey}
    components={{
      FilterLayout,
      EmptyBodyRow,
      TableLayout: SettingsTableLayout,
    }}
    alterColumns={{
      name: {
        components: {
          BodyCell: NameCell,
        },
      },
      description: {
        sortable: false,
      },
    }}
    columnSet={['name', 'description']}
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
                <I18n>Teams</I18n>
              </h1>
            </div>
            <div className="page-title__actions">
              <Link to="../settings/teams/new">
                <I18n
                  render={translate => (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      title={translate('New Team')}
                    >
                      <span className="fa fa-plus fa-fw" />{' '}
                      {translate('New Team')}
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
  </TeamTable>
);
