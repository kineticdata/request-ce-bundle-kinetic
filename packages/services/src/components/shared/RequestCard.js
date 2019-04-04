import React from 'react';
import { Link } from '@reach/router';
import { Icon, TimeAgo } from 'common';
import { StatusPill } from './StatusPill';
import * as helpers from '../../utils';
import * as constants from '../../constants';
import { Form } from '../../models';
import { I18n } from '../../../../app/src/I18nProvider';

const DisplayDateListItem = ({ submission }) => {
  const isDraft = submission.coreState === constants.CORE_STATE_DRAFT;
  return (
    <div className="col">
      <dt className="">
        <I18n>{isDraft ? 'Created' : 'Submitted'}</I18n>
      </dt>
      <dd className="">
        <TimeAgo
          timestamp={isDraft ? submission.createdAt : submission.submittedAt}
        />
      </dd>
    </div>
  );
};

const EstCompletionListItem = ({ submission }) => {
  const dueDate = helpers.getDueDate(
    submission,
    constants.ATTRIBUTE_SERVICE_DAYS_DUE,
  );
  return (
    submission.coreState === constants.CORE_STATE_SUBMITTED && (
      <div className="col">
        <dt className="">
          <I18n>Est. Completion</I18n>
        </dt>
        <dd className="">
          <TimeAgo timestamp={dueDate} />
        </dd>
      </div>
    )
  );
};

const ClosedDateListItem = ({ submission }) =>
  submission.coreState === constants.CORE_STATE_CLOSED && (
    <div className="col">
      <dt className="">
        <I18n>Closed</I18n>
      </dt>
      <dd className="">
        <TimeAgo timestamp={submission.closedAt} />
      </dd>
    </div>
  );

const SubmissionSummary = ({ submission }) => (
  <p>
    {submission.label === submission.id ? (
      <I18n>{submission.form.description}</I18n>
    ) : (
      submission.label
    )}
  </p>
);

export const RequestCard = props => {
  const form = props.submission.form;
  return (
    <Link to={props.path} className="card card--request">
      <h1>
        <Icon image={Form(form).icon} background="greenGrass" />
        <span>
          <I18n
            context={`kapps.${form.kapp && form.kapp.slug}.forms.${form.slug}`}
          >
            {form.name}
          </I18n>
        </span>
        <StatusPill submission={props.submission} />
      </h1>
      <SubmissionSummary submission={props.submission} />
      <span className="meta">
        <dl className="row">
          <div className="col">
            <dt>
              <I18n context="foo">Confirmation</I18n>
            </dt>
            <dd>{props.submission.handle}</dd>
          </div>
          <DisplayDateListItem submission={props.submission} />
          <EstCompletionListItem submission={props.submission} />
          <ClosedDateListItem submission={props.submission} />
        </dl>
      </span>
    </Link>
  );
};
