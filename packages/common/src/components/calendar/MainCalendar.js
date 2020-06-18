import React, { Fragment, Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import listPlugin from '@fullcalendar/list';
import { EventModal } from './CalendarModals';

export class MainCalendar extends Component {
  constructor(props) {
    super(props);
    this.calendarRef = createRef();
  }

  handlerDateChange = () => {
    const date = this.calendarRef.current.getApi().getDate();
    this.props.handleMainNavigateChange(date);

    // Update redux with the selected view type
    const selectedView = this.calendarRef.current.getApi().view.type;
    const viewObject = {
      dayGridMonth: 'month',
      timeGridWeek: 'week',
      timeGridDay: 'day',
      listWeek: 'agenda',
    };
    this.props.handleMainViewChange(viewObject[selectedView]);
  };

  handleEventClick = ({ event }) => {
    // Take event from fullcalendar and reformat to passed in event
    event = {
      allDay: event.allDay,
      details: event.extendedProps.details,
      end: event.end,
      filter: event.extendedProps.filter,
      key: event.extendedProps.key,
      start: event.start,
      title: event.title,
      type: event.extendedProps.type,
    };
    this.props.handleMainEventSelect(event);
  };

  componentDidUpdate(prevProps) {
    if (!this.props.selectedDate.isSame(prevProps.selectedDate)) {
      this.calendarRef.current
        .getApi()
        .gotoDate(this.props.selectedDate.format());
    }
    if (this.props.timezone !== prevProps.timezone) {
      this.calendarRef.current
        .getApi()
        .setOption('timeZone', this.props.timezone);
    }
    if (this.props.mainCalendarView !== prevProps.mainCalendarView) {
      const viewObject = {
        month: 'dayGridMonth',
        week: 'timeGridWeek',
        day: 'timeGridDay',
        agenda: 'listWeek',
      };
      this.calendarRef.current
        .getApi()
        .changeView(viewObject[this.props.mainCalendarView]);
    }
  }

  render() {
    return (
      <Fragment>
        <FullCalendar
          events={this.props.events.filter(event => !event.filter)}
          // For now all text color is white.  Black made the text unreadable.
          eventTextColor="#ffffff"
          ref={this.calendarRef}
          height={'parent'}
          contentHeight={'auto'}
          eventLimit={3}
          defaultView="dayGridMonth"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            momentTimezonePlugin,
            listPlugin,
          ]}
          header={{
            left: 'prev,today,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          buttonText={{
            timeGridDay: 'Day',
            dayGridMonth: 'Month',
            timeGridWeek: 'Week',
            listWeek: 'List',
            today: 'Today',
            prev: 'Previous',
            next: 'Next',
          }}
          navLinks={true}
          datesRender={() => {
            if (this.calendarRef.current) {
              this.handlerDateChange();
            }
          }}
          eventClick={this.handleEventClick}
          fixedWeekCount={false}
          showNonCurrentDates={false}
        />
        {this.props.eventModalOpen &&
          (this.props.eventModal ? (
            // User defined modal
            this.props.eventModal({
              toggle: () => {
                this.props.handleMainEventSelect(null);
              },
              event: this.props.mainCalendarEvent,
              timezone: this.props.timezone,
              eventModalOpen: this.props.eventModalOpen,
            })
          ) : (
            // Default modal
            <EventModal
              toggle={() => {
                this.props.handleMainEventSelect(null);
              }}
              event={this.props.mainCalendarEvent}
              timezone={this.props.timezone}
              eventModalOpen={this.props.eventModalOpen}
              details={renderEventDetail => {
                const details = this.props.mainCalendarEvent.details;
                return (
                  <div className="p-3">
                    {Object.keys(details.toJS()).map(key =>
                      renderEventDetail(
                        key,
                        details.get(key),
                        this.props.timezone,
                      ),
                    )}
                  </div>
                );
              }}
            />
          ))}
      </Fragment>
    );
  }
}
