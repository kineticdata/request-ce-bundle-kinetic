import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import { PopConfirm } from '../shared/PopConfirm';
import { Button } from 'reactstrap';
import { actions as appActions } from '../../redux/modules/spaceApp';

const AlertComponent = ({
  alert,
  canEdit,
  openDeleteConfirm,
  toggleDeleteConfirm,
  deleteAlert,
}) => (
  <tr>
    {alert.values.URL ? (
      <td scope="row">
        <a href={alert.values.URL} target="blank">
          {alert.values.Title}
          <i className="fa fa-fw fa-external-link " />
        </a>
      </td>
    ) : (
      <td>{alert.values.Title}</td>
    )}
    <td dangerouslySetInnerHTML={{ __html: alert.values.Content }} />
    {canEdit && (
      <td>
        <div className="btn-group btn-group-sm">
          <button
            id={`alert-confirm-${alert.id}`}
            className="btn btn-danger"
            onClick={toggleDeleteConfirm(alert.id)}
          >
            <span className="fa fa-fw fa-close" />
          </button>
          <Link className="btn btn-primary" to={`/alerts/${alert.id}`}>
            <span className="fa fa-fw fa-pencil" />
          </Link>
        </div>
        <PopConfirm
          target={`alert-confirm-${alert.id}`}
          placement="left"
          isOpen={alert.id === openDeleteConfirm}
          toggle={toggleDeleteConfirm()}
        >
          <p>Remove Alert?</p>
          <Button color="danger" onClick={() => deleteAlert(alert.id)}>
            Yes
          </Button>
          <Button color="link" onClick={toggleDeleteConfirm()}>
            No
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
  deleteAlert: appActions.deleteAlert,
};

export const Alert = compose(
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
)(AlertComponent);
