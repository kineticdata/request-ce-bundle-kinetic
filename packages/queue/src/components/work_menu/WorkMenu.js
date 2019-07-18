import React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { actions } from '../../redux/modules/workMenu';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { CoreForm } from '@kineticdata/react';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';

const globals = import('common/globals');

export const WorkMenu = ({
  queueItem,
  complete,
  mode,
  handleCloseClick,
  handleLoaded,
  handleUpdated,
  handleCompleted,
  handleSaveClick,
}) =>
  queueItem && (
    <Modal isOpen toggle={handleCloseClick} size="lg" backdrop="static">
      <div className="modal-header">
        <h4 className="modal-title">
          <button
            type="button"
            className="btn btn-link"
            onClick={handleCloseClick}
          >
            <I18n>Close</I18n>
          </button>
          <span>
            <I18n>{`${mode} It`}</I18n>
          </span>
        </h4>
      </div>
      <ModalBody>
        <I18n
          context={`kapps.${queueItem.form.kapp.slug}.forms.${
            queueItem.form.slug
          }`}
        >
          <CoreForm
            globals={globals}
            submission={queueItem.id}
            review={queueItem.coreState !== 'Draft'}
            onLoaded={handleLoaded}
            onUpdated={handleUpdated}
            onCompleted={handleCompleted}
          />
        </I18n>
      </ModalBody>
      {mode === 'Work' &&
        !complete && (
          <ModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveClick}
            >
              <I18n>Save</I18n>{' '}
              <I18n
                context={`kapps.${queueItem.form.kapp.slug}.forms.${
                  queueItem.form.slug
                }`}
              >
                {queueItem.form.name}
              </I18n>
            </button>
          </ModalFooter>
        )}
    </Modal>
  );

export const mapStateToProps = state => ({
  queueItem: state.workMenu.queueItem,
  onWorked: state.workMenu.onWorked,
});
export const mapDispatchToProps = {
  closeWorkMenu: actions.closeWorkMenu,
};

export const WorkMenuContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('complete', 'setComplete', false),
  withProps(({ queueItem }) => ({
    mode: queueItem && queueItem.coreState === 'Draft' ? 'Work' : 'Review',
  })),
  withHandlers(() => {
    let kineticForm = null;
    return {
      handleLoaded: () => form => {
        kineticForm = form;
      },
      handleUpdated: props => (response, actions) => {
        // If the result of submitPage is an update and we do not advance pages
        // on the submission we will close the work menu. Also call actions.stop
        // to prevent a needless AJAX call to reload the embedded form.
        if (response.submission.currentPage === kineticForm.page().name()) {
          actions.stop();
          props.closeWorkMenu();
        }
        if (typeof props.onWorked === 'function') {
          props.onWorked(response.submission);
        }
      },
      handleCompleted: props => (response, actions) => {
        // If the result of submitPage is a complete and we advance to a virtual
        // confirmation page (currentPage === null) we close the work menu and
        // stop the subsequent AJAX call. If the page is not null then we will
        // set the 'completed' state to true and let the embedded form reload
        // so the confirmation page is shown.
        if (response.submission.currentPage === null) {
          actions.stop();
          props.closeWorkMenu();
        } else {
          props.setComplete(true);
        }
      },
      handleSaveClick: () => () => {
        kineticForm.submitPage();
      },
      handleCloseClick: props => () => {
        props.closeWorkMenu();
        props.setComplete(false);
      },
    };
  }),
)(WorkMenu);
