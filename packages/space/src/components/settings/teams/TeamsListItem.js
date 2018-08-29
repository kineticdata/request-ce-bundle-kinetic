import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { getTeamColor, getTeamIcon } from '../../../utils';

const TeamsListItemComponent = ({ team, openDropdown, toggleDropdown }) => {
  return (
    <tr key={team.slug}>
      <Fragment>
        <td className="d-md-none d-table-cell">
          <div className="card card--team">
            <div
              className="card--team__header"
              style={{ backgroundColor: getTeamColor(team) }}
            >
              <i className={`fa fa-${getTeamIcon(team)} card-icon`} />
              <span />
            </div>
            <div className="card--team__body">
              <h1>{team.name}</h1>
              <pre>{team.description}</pre>

              <div className="btn-group" role="group" aria-label="Actions">
                <Link
                  to={`/settings/teams/${team.slug}`}
                  className="btn btn-primary"
                >
                  View
                </Link>
                <Link
                  to={`/settings/teams/${team.slug}/edit`}
                  className="btn btn-info"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </td>
      </Fragment>
      <td>
        <Link to={`/settings/teams/${team.slug}`}>{team.name}</Link>
      </td>
      <td className="d-none d-md-table-cell">{team.description}</td>
      <td className="d-none d-md-table-cell">
        <Dropdown
          toggle={toggleDropdown(team.slug)}
          isOpen={openDropdown === team.slug}
        >
          <DropdownToggle color="link">
            <span className="fa fa-ellipsis-h fa-2x" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag={Link} to={`/settings/teams/${team.slug}`}>
              View
            </DropdownItem>
            <DropdownItem tag={Link} to={`/settings/teams/${team.slug}/edit`}>
              Edit
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </td>
    </tr>
  );
};

export const mapStateToProps = state => ({});

export const mapDispatchToProps = {
  push,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const TeamsListItem = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({ toggleDropdown }),
)(TeamsListItemComponent);
