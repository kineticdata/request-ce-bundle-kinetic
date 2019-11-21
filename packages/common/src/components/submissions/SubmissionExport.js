import React, { Component, Fragment } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from '@kineticdata/react';
import { isImmutable } from 'immutable';
import { ModalButton } from '../ModalButton';
import { LoadingMessage, ErrorMessage } from '../StateMessages';

const DefaultToggleButton = props => (
  <I18n
    render={translate => (
      <button
        className="btn btn-secondary"
        title={translate('Export')}
        {...props}
      >
        <span className="fa fa fa-download fa-fw" /> {translate('Export')}
      </button>
    )}
  />
);

const generateModalLayout = ({ title, isOpen, close, toggle }) => ({
  onExport,
  exporting,
  content,
  button,
}) => (
  <Modal
    isOpen={isOpen}
    toggle={toggle}
    size="md"
    backdrop={exporting ? 'static' : true}
    keyboard={!exporting}
  >
    <form onSubmit={onExport} className="p-0">
      <div className="modal-header">
        <h4 className="modal-title">
          <button
            className="btn btn-link btn-delete"
            onClick={close}
            disabled={exporting}
          >
            <I18n>Close</I18n>
          </button>
          <span>
            <I18n>{title}</I18n>
          </span>
        </h4>
      </div>
      <ModalBody className="p-3">{content}</ModalBody>
      <ModalFooter className="modal-footer--full-width">{button}</ModalFooter>
    </form>
  </Modal>
);

export const SubmissionExportModalButton = ({
  components: { ToggleButton = DefaultToggleButton, ...components } = {},
  title,
  ...props
}) => (
  <ModalButton components={{ ToggleButton }}>
    {modalProps => (
      <SubmissionExport
        components={{
          Layout: generateModalLayout({ title, ...modalProps }),
          ...components,
        }}
        {...props}
      />
    )}
  </ModalButton>
);

const DefaultLayout = ({ onExport, content, button }) => (
  <form onSubmit={onExport}>
    {content}
    <div>{button}</div>
  </form>
);

const DefaultExportButton = props => (
  <I18n
    render={translate => (
      <button
        className="btn btn-primary"
        title={translate('Export')}
        {...props}
      >
        {translate('Export')}
      </button>
    )}
  />
);

export class SubmissionExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: !props.formSlug
        ? { message: 'SubmissionExport Error: The formSlug prop is required.' }
        : !props.kappSlug && !props.datastore
          ? {
              message:
                'SubmissionExport Error: Either the kappSlug or datastore prop is required.',
            }
          : null,
      ready: true,
    };
  }

  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}

  render() {
    const { components } = this.props;
    const {
      Layout = DefaultLayout,
      ExportButton = DefaultExportButton,
    } = components;

    const button = <ExportButton type="submit" />;

    const content = this.state.error ? (
      <ErrorMessage message={this.state.error.message} />
    ) : this.state.ready ? (
      'Not implemented'
    ) : (
      <LoadingMessage />
    );

    return (
      <Layout
        onExport={e => {
          e.preventDefault();
          console.log('Not implemented');
        }}
        exporting={false}
        content={content}
        button={button}
      />
    );
  }
}
