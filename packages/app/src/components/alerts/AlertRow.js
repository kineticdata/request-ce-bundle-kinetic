import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import { PopConfirm } from '../shared/PopConfirm';
import { Button } from 'reactstrap';
import { I18n } from '@kineticdata/react';
import { actions } from '../../redux/modules/alerts';

const AlertRowComponent = ({
  alert,
  canEdit,
  openDeleteConfirm,
  toggleDeleteConfirm,
  deleteAlertRequest,
}) => (
  <tr>
    {alert.values.URL ? (
      <td>
        <a href={alert.values.URL} target="_blank" rel="noopener noreferrer">
          <I18n>{alert.values.Title}</I18n>
          <i className="fa fa-fw fa-external-link " />
        </a>
      </td>
    ) : (
      <td>
        <I18n>{alert.values.Title}</I18n>
      </td>
    )}
    <I18n
      render={translate => (
        <td
          dangerouslySetInnerHTML={{ __html: translate(alert.values.Content) }}
        />
      )}
    />
    {canEdit && (
      <td>
        <div className="btn-group btn-group-sm">
          <button
            id={`alert-confirm-${alert.id}`}
            className="btn btn-danger"
            onClick={toggleDeleteConfirm(alert.id)}
          >
            <span className="sr-only">Delete Alert</span>
            <span className="fa fa-fw fa-times" />
          </button>
          <Link className="btn btn-primary" to={`/alerts/${alert.id}`}>
            <span className="sr-only">Edit Alert</span>{' '}
            <span className="fa fa-fw fa-pencil" />
          </Link>
        </div>
        <PopConfirm
          target={`alert-confirm-${alert.id}`}
          placement="left"
          isOpen={alert.id === openDeleteConfirm}
          toggle={toggleDeleteConfirm()}
        >
          <p>
            <I18n>Remove Alert?</I18n>
          </p>
          <Button color="danger" onClick={() => deleteAlertRequest(alert.id)}>
            <I18n>Yes</I18n>
          </Button>
          <Button color="link" onClick={toggleDeleteConfirm()}>
            <I18n>No</I18n>
          </Button>
        </PopConfirm>
      </td>
    )}
  </tr>
);

export const mapStateToProps = state => ({
  canEdit: state.app.profile.spaceAdmin ? true : false,
});

export const mapDispatchToProps = {
  deleteAlertRequest: actions.deleteAlertRequest,
};

export const AlertRow = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openDeleteConfirm', 'setOpenDeleteConfirm', null),
  withHandlers({
    toggleDeleteConfirm: ({
      openDeleteConfirm,
      setOpenDeleteConfirm,
    }) => alertId => () => {
      if (openDeleteConfirm) {
        setOpenDeleteConfirm(null);
      } else {
        setOpenDeleteConfirm(alertId);
      }
    },
  }),
)(AlertRowComponent);
