import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import { TimeAgo } from 'common';
import { Avatar } from 'common';
import { actions } from '../../redux/modules/about';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

const AboutComponent = ({ space, about, loading }) => (
  <div className="page-container page-container--space-about">
    <PageTitle parts={['About']} />
    {!loading && (
      <div className="page-panel page-panel--space-about">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">
                <I18n>home</I18n>
              </Link>{' '}
              /
            </h3>
            <h1>
              <I18n>About My Space</I18n>
            </h1>
          </div>
        </div>
        <div className="page-content page-content--space-about">
          <section>
            <h2 className="section__title">
              <I18n>General</I18n>
            </h2>
            <div className="data-list-row">
              <dl className="data-list-row__col">
                <dt>
                  <I18n>Space Name</I18n>
                </dt>
                <dd>{space.name}</dd>
              </dl>

              <dl className="data-list-row__col">
                <dt>
                  <I18n>User Base</I18n>
                </dt>
                <dd>
                  {about.numberOfUsers} <I18n>users in</I18n>{' '}
                  {about.numberOfTeams} <I18n>teams</I18n>
                </dd>
              </dl>

              <dl className="data-list-row__col">
                <dt>
                  <I18n>Created At</I18n>
                </dt>
                <dd>
                  <TimeAgo timestamp={space.createdAt} id={space.slug} />
                </dd>
              </dl>
            </div>
          </section>
          <section>
            <h2 className="section__title">
              <I18n>Space Admins</I18n>
            </h2>

            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th />
                  <th scope="col">
                    <I18n>Email</I18n>
                  </th>
                  <th scope="col">
                    <I18n>Display Name</I18n>
                  </th>
                </tr>
              </thead>
              <tbody>
                {about.spaceAdmins.map(user => (
                  <tr key={user.username}>
                    <td scope="row">
                      <Avatar username={user.username} />
                    </td>
                    <td>
                      <Link to={`/profile/${user.username || user.email}`}>
                        {user.email}
                      </Link>
                    </td>
                    <td>{user.displayName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    )}
  </div>
);

const mapStateToProps = state => ({
  space: state.app.space,
  about: state.about.data,
  loading: state.about.loading,
});

const mapDispatchToProps = {
  fetchAbout: actions.fetchAbout,
};

export const About = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchAbout();
    },
  }),
)(AboutComponent);
