import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { Table } from '@kineticdata/react';
import { TimeAgo } from 'common';
import { Map, List } from 'immutable';
import { StatusPill } from '../shared/StatusPill';

const columns = [
  {
    value: 'name',
    title: 'Name',
    type: 'text',
  },
  {
    value: 'status',
    title: 'Status',
    type: 'text',
  },
  {
    value: 'createdAt',
    title: 'Created',
    type: 'text',
  },
  {
    value: 'closedAt',
    title: 'Closed',
    type: 'text',
  },
];

const columnSet = ['name', 'status', 'createdAt', 'closedAt'];

const NameCell = surveyItem => (
  <td>
    <Link to={`${surveyItem.row.get('slug')}/submissions`}>
      {surveyItem.row.get('name')}
    </Link>
  </td>
);

const TimeAgoCell = surveyItem => (
  <td>
    {surveyItem.value === 'N/A' ? (
      surveyItem.value
    ) : (
      <TimeAgo timestamp={surveyItem.value} />
    )}
  </td>
);

const StatusCell = surveyItem => (
  <td>
    <StatusPill status={surveyItem.row.get('status')} />
  </td>
);

// const EmptyBodyRow = generateEmptyBodyRow({
//   loadingMessage: 'Loading surveys...',
//   noSearchResultsMessage:
//     'No surveys found - please modify your search criteria',
//   noItemsMessage: 'There are no surveys to display.',
// });

// const FilterLayout = generateFilterLayout(['name']);

export const SurveyTable = ({ surveyData }) => {
  const mappedData = surveyData.map(survey => {
    return Map({
      name: survey.name,
      status: survey.status,
      createdAt: survey.createdAt,
      closedAt: 'N/A',
      slug: survey.slug,
    });
  });
  return (
    <Table
      data={mappedData}
      columns={columns}
      columnSet={columnSet}
      // components={{ EmptyBodyRow, FilterLayout }}
      alterColumns={{
        name: {
          components: {
            BodyCell: NameCell,
          },
        },
        status: {
          components: {
            BodyCell: StatusCell,
          },
        },
        createdAt: {
          components: {
            BodyCell: TimeAgoCell,
          },
        },
        closedAt: {
          components: {
            BodyCell: TimeAgoCell,
          },
        },
      }}
    >
      {({ table, pagination }) => <Fragment>{table}</Fragment>}
    </Table>
  );
};
