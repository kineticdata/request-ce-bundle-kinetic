import React, { Fragment } from 'react';
import { Route } from 'react-router';
import { SpaceHome, TeamList, Team } from 'space';
import { QueueHome, QueueList, QueueItem } from 'queue';
import { ServicesHome, CategoryList, Category } from 'services';

const SpaceRouter = () => (
  <Fragment>
    <Route exact path="/" component={SpaceHome} />
    <Route exact path="/teams" component={TeamList} />
    <Route exact path="/team/:teamId" component={Team} />
  </Fragment>
);

const ServicesRouter = ({ slug }) => (
  <Fragment>
    <Route exact path={`/kapps/${slug}`} component={ServicesHome} />
    <Route exact path={`/kapps/${slug}/cat`} component={CategoryList} />
    <Route exact path={`/kapps/${slug}/cat/:catSlug`} component={Category} />
  </Fragment>
);

const QueueRouter = ({ slug }) => (
  <Fragment>
    <Route exact path={`/kapps/${slug}`} component={QueueHome} />
    <Route exact path={`/kapps/${slug}/mine`} component={QueueList} />
    <Route exact path={`/kapps/${slug}/mine/:itemId`} component={QueueItem} />
  </Fragment>
);

const KappRouter = ({ kapp }) =>
  kapp.slug === 'queue' ? (
    <QueueRouter slug={kapp.slug} />
  ) : (
    <ServicesRouter slug={kapp.slug} />
  );

export const AppRouter = ({ kapps }) => (
  <Fragment>
    <SpaceRouter />
    {kapps.map(kapp => <KappRouter key={kapp.slug} kapp={kapp} />)}
  </Fragment>
);
