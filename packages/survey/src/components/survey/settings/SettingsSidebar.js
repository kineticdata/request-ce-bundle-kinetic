import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose, withProps } from 'recompose';
import { actions as notificationsActions } from '../../../redux/modules/notifications';
import {
  DEFAULT_NOTIFICATION_TEMPLATE_NAME,
  DEFAULT_NOTIFICATION_OPT_OUT_TEMPLATE_NAME,
} from '../../../constants';

export const SettingsSidebarComponent = ({
  tab,
  cloneNotification,
  defaultTemplate,
  defaultOptOutTemplate,
}) =>
  tab === '1' ? (
    <Fragment>
      <h3>General Settings</h3>
      <br />
      <p>
        <b>Survey Name</b> will be visible to the owning team and individual
        (see Permissions tab), but not the individuals who take the survey.
      </p>
      <p>
        <b>Survey Slug</b> will be visible in the URL to the individuals who
        take the survey. While this defaults to a url friendly copy of the
        Survey Name, they do not have to match.
      </p>
      <p>
        <b>Description</b> is for the owning team and individual. The
        individuals taking the survey do not see this value.
      </p>
      <p>
        <b>Survey Label</b> will be used to help differentiate the survey
        submissions (the instances of the survey) from each other. Use text and
        submission values (click on the {'</>'} to add fields) to create a
        useful label. For example, if you could use:
      </p>
      <p>values('Recipient Id')'s survey for ticket values('Reference Id')</p>
      <p>And the resulting list of surveys might look like this:</p>
      <p>
        btigges’s survey for ticket 23456
        <br />jsundberg’s survey for ticket 34956
      </p>
    </Fragment>
  ) : tab === '2' ? (
    <Fragment>
      <h3>Workflow Process</h3>
      <br />
      <p>
        There is not, by default, any workflow that runs when a user submits
        their survey. The data is simply recorded as their submission. If you
        would like a process to run after the person submits their survey,
        please set <b>Run Workflow Process on Submit</b> to Yes. You will then
        be able to access the workflow builder for this survey.
      </p>
    </Fragment>
  ) : tab === '6' ? (
    <Fragment>
      <h3>Notifications</h3>
      <br />
      <p>
        <b>Invitation Notification Template</b> is the notification that is sent
        to the survey recipient when their survey is created. This text is
        rather general by default. If desired please clone this notification
        template and create your custom notification by{' '}
        <span
          className="survey-settings-sidebar-link"
          onClick={() => cloneNotification(defaultTemplate.id)}
          role="button"
          tabIndex={0}
        >
          clicking here
        </span>.{' '}
        <u>
          If your survey allows users to Opt Out, please update this
          notification to be Survey Invitation with Opt Out
        </u>. To start your custom notification using the Opt Out template,{' '}
        <span
          className="survey-settings-sidebar-link"
          onClick={() => cloneNotification(defaultOptOutTemplate.id)}
          role="button"
          tabIndex={0}
        >
          click here
        </span>.
      </p>
      <p>
        <b>Reminder Notifications Template</b> is the notification that is sent
        to the survey recipient if reminders are configured. If the user hasn’t
        responded to the survey, the user will get up to{' '}
        <b>Reminder Notifications Max</b> reminders{' '}
        <b>Reminder Notifications Interval</b> days apart.{' '}
        <u>There are no reminders configured by default</u>. Note that this uses
        the generic invitation text by default. If desired please clone this
        notification template and create your custom notification by{' '}
        <span
          className="survey-settings-sidebar-link"
          onClick={() => cloneNotification(defaultTemplate.id)}
          role="button"
          tabIndex={0}
        >
          clicking here
        </span>.{' '}
        <u>
          If your survey allows users to Opt Out, please update this
          notification to be Survey Invitation with Opt Out
        </u>. To start your custom notification using the Opt Out template,{' '}
        <span
          className="survey-settings-sidebar-link"
          onClick={() => cloneNotification(defaultOptOutTemplate.id)}
          role="button"
          tabIndex={0}
        >
          click here
        </span>.
      </p>
    </Fragment>
  ) : tab === '3' ? (
    <Fragment>
      <h3>Triggers</h3>
      <br />
      <p>
        Polling should only be used if the system triggering the survey cannot
        make outbound calls. Remedy 9.2 and earlier are an example of a system
        that must use polling.
      </p>

      <p>
        Non-polling surveys should use a webhook or some other method to make a
        call to the survey system. The required information to be passed is:
      </p>
      <ul className="small">
        <li>
          userId: the id in the platform for the person to receive the survey
        </li>
        <li>
          surveySlug: the slug, or unique identifier, for the survey to be
          created/sent
        </li>
        <li>
          referenceId: the ticket id or other reference number for the ticket
          the survey is being created for.
        </li>
        <li>
          data: any other information about the ticket/item triggering the
          survey
        </li>
      </ul>
    </Fragment>
  ) : tab === '4' ? (
    <Fragment>
      <h3>Delivery Rules</h3>
      <br />
      <p>
        <b>Expiration in Days</b> is the number of days the user has to take a
        copy of the survey sent to them. This is not an expiration for the
        survey itself.
      </p>
      <p>
        <b>Allow Opt Out</b> allows the user to specify (using the form linked
        in the notifications sent to them) to indicate that they do not want to
        receive future notifications/copies of this particular survey.
      </p>
      <p>
        <b>Max Frequency Count</b> and <b>Max Frequency Days</b> allows you to
        control the maximum number of surveys that will be sent to a given
        individual in those number of days. For example, if this is an incident
        survey, you may not want to send more than one satisfaction survey a
        week (Max count: 1, Days: 7). The default is essentially having no
        limit.
      </p>
    </Fragment>
  ) : (
    tab === '5' && (
      <Fragment>
        <h3>Security</h3>
        <br />
        <p>
          <b>Owning Team</b> is the team who is allowed to see survey
          submissions and modify the survey.
        </p>
        <p>
          <b>Owning Individual</b> is a person with the same rights. This
          defaults to the individual who created the survey.
        </p>
      </Fragment>
    )
  );

export const mapStateToProps = (state, { slug }) => ({
  kappSlug: state.app.kappSlug,
  formSlug: slug,
  templates: state.notifications.notificationTemplates,
});

export const mapDispatchToProps = {
  fetchNotifications: notificationsActions.fetchNotifications,
  cloneNotification: notificationsActions.cloneNotification,
};

export const SettingsSidebar = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    defaultTemplate:
      props.templates &&
      props.templates.find(
        template =>
          template.values['Name'] === DEFAULT_NOTIFICATION_TEMPLATE_NAME,
      ),
    defaultOptOutTemplate:
      props.templates &&
      props.templates.find(
        template =>
          template.values['Name'] ===
          DEFAULT_NOTIFICATION_OPT_OUT_TEMPLATE_NAME,
      ),
  })),
)(SettingsSidebarComponent);
