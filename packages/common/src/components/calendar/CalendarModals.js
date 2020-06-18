import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { I18n, Moment } from '@kineticdata/react';
import moment from 'moment';

const renderEventDetail = (key, detail, timezone) => {
  let displayValue;
  if (typeof detail === 'object') {
    switch (detail.type) {
      case 'date-time':
        displayValue = (
          <Moment
            timestamp={moment(detail.value).tz(timezone)}
            format={detail.format}
          />
        );
        break;
      case 'hidden':
        return null;
      default:
        console.warn(
          'A valid type was not provided in the calendar detail mapping',
        );
        displayValue = '';
    }
  } else {
    displayValue = detail;
  }
  return (
    <div className="evt-field" key={key}>
      <div className="evt-field--name">
        <b>{key}</b>
      </div>
      <div>{displayValue}</div>
    </div>
  );
};

export const DateModal = props => (
  <Modal isOpen={props.dateModalOpen} toggle={props.toggle} size="md">
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={props.toggle}>
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>{props.title ? props.title : 'Create Event'}</I18n>
        </span>
      </h4>
    </div>
    <ModalBody>
      <div className="p-5">
        {props.event.start ? (
          <div>
            <p>
              Start:{' '}
              <Moment
                timestamp={moment(props.event.start).tz(props.timezone)}
                format={Moment.formats.dateTimeWithDayShort}
              />
            </p>
            <p>
              End:{' '}
              <Moment
                timestamp={moment(props.event.end).tz(props.timezone)}
                format={Moment.formats.dateTimeWithDayShort}
              />
            </p>
          </div>
        ) : (
          <p>
            <Moment
              timestamp={props.event}
              format={Moment.formats.dateTimeWithDayShort}
            />
          </p>
        )}
        <p>Insert Event Form Here</p>
      </div>
    </ModalBody>
  </Modal>
);

export const EventModal = ({
  eventModalOpen,
  toggle,
  title,
  event,
  additionalHeadElements,
  timezone,
  body,
  details
}) => (
  <Modal isOpen={eventModalOpen} toggle={toggle} size="md">
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={toggle}>
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>{title ? title : event.title}</I18n>
        </span>
      </h4>
      {additionalHeadElements ? (
        additionalHeadElements()
      ) : (
        <div className="p-3">
          <div>
            <span>
              <Moment
                timestamp={moment(event.start).tz(timezone)}
                format={'LLL'}
              />{' '}
              -{' '}
              <Moment
                timestamp={moment(event.end).tz(timezone)}
                format={'LLL'}
              />
            </span>
          </div>
          <div>{event.type}</div>
        </div>
      )}
    </div>
    <ModalBody>
      {body
        ? body()
        : details
          ? details(renderEventDetail)
          : 'Body display'}
    </ModalBody>
  </Modal>
);
