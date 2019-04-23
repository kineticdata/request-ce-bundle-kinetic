import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from '@reach/router';
import { PopConfirm } from '../shared/PopConfirm';
import { Button } from 'reactstrap';
import { context } from '../../redux/store';
import { I18n } from '../../../../app/src/I18nProvider';
import { actions } from '../../redux/modules/alerts';

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
        <a href={alert.values.URL} target="_blank">
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
          <p>
            <I18n>Remove Alert?</I18n>
          </p>
          <Button color="danger" onClick={() => deleteAlert(alert.id)}>
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
  deleteAlert: actions.deleteAlert,
};

export const Alert = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
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
