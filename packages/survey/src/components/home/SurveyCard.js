import React from 'react';
import { Icon, TimeAgo } from 'common';
import { Link } from '@reach/router';
import { I18n } from '@kineticdata/react';
import { StatusPill } from '../shared/StatusPill';

export const SurveyCard = ({ survey }) => (
  <Link to={`${survey.slug}/submissions`} className="card card--survey">
    <h1>
      <Icon image="pencil-square" background="blueSlate" />
      <I18n>{survey.name}</I18n>
      <StatusPill status={survey.bridgeModel.status} />
    </h1>
    <p>
      <I18n>{survey.description ? survey.description : 'No Description'}</I18n>
    </p>
    <br />
    <span className="meta">
      <dl className="row">
        <div className="col">
          <dt>
            <I18n context="foo">Created</I18n>
          </dt>
          <dd>
            <TimeAgo timestamp={survey.createdAt} />
          </dd>
        </div>
        <div className="col">
          <dt>
            <I18n context="foo">Closed</I18n>
          </dt>
          <dd>
            <I18n>N/A</I18n>
            {/* <TimeAgo timestamp={''} /> */}
          </dd>
        </div>
      </dl>
    </span>
  </Link>
);
