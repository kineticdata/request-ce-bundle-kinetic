import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TimeAgo, PageTitle } from 'common';
import { Avatar } from 'common';
import { actions } from '../../redux/modules/about';

const AboutComponent = ({ space, about, loading }) => (
  <div className="page-container page-container--space-about">
    <PageTitle parts={['About']} />
    {!loading && (
      <div className="page-panel page-panel--space-about">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /
            </h3>
            <h1>About My Space</h1>
          </div>
        </div>
        <div className="page-content page-content--space-about">
          <section>
            <h2 className="section__title">General</h2>
            <div className="data-list-row">
              <dl className="data-list-row__col">
                <dt>Space Name</dt>
                <dd>{space.name}</dd>
              </dl>

              <dl className="data-list-row__col">
                <dt>User Base</dt>
                <dd>
                  {about.numberOfUsers} users in {about.numberOfTeams} teams
                </dd>
              </dl>

              <dl className="data-list-row__col">
                <dt>Created At</dt>
                <dd>
                  <TimeAgo timestamp={space.createdAt} id={space.slug} />
                </dd>
              </dl>
            </div>
          </section>
          <section>
            <h2 className="section__title">Space Admins</h2>

            <table className="table table-responsive-sm">
              <thead>
                <tr>
                  <th />
                  <th scope="col">Email</th>
                  <th scope="col">Display Name</th>
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
  about: state.space.about.data,
  loading: state.space.about.loading,
});

const mapDispatchToProps = {
  fetchAbout: actions.fetchAbout,
};

export const About = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchAbout();
    },
  }),
)(AboutComponent);
