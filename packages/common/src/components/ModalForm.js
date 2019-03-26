import React from 'react';
import { CoreForm } from '@kineticdata/react';
import { Modal, ModalBody } from 'reactstrap';
import { ErrorNotFound } from './ErrorNotFound';
import { ErrorUnauthorized } from './ErrorUnauthorized';
import { ErrorUnexpected } from './ErrorUnexpected';
import { I18n } from '../../../app/src/I18nProvider';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
//const globals = import('../../globals');

export const ModalForm = ({
  form,
  isCompleted,
  handleCompleted,
  handleClosed,
}) =>
  form && (
    <I18n context={`kapps.${form.kappSlug}.forms.${form.formSlug}`}>
      <Modal isOpen toggle={handleClosed} size="lg">
        <div className="modal-header">
          <h4 className="modal-title">
            <button
              type="button"
              className="btn btn-link"
              onClick={handleClosed}
            >
              <I18n>Close</I18n>
            </button>
            <span>
              <I18n>{form.title}</I18n>
            </span>
            <span />
          </h4>
        </div>
        <ModalBody>
          {isCompleted ? (
            <div className="modal-confirmation">
              <p>
                <I18n>{form.confirmationMessage}</I18n>
              </p>
            </div>
          ) : (
            <CoreForm
              kapp={form.kappSlug}
              form={form.formSlug}
              values={form.values}
              //globals={globals}
              onCompleted={handleCompleted}
              notFoundComponent={ErrorNotFound}
              unauthorizedComponent={ErrorUnauthorized}
              unexpectedErrorComponent={ErrorUnexpected}
            />
          )}
        </ModalBody>
      </Modal>
    </I18n>
  );
