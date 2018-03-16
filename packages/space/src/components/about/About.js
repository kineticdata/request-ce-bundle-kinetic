import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TimeAgo } from 'common';
import { Avatar } from '../shared/Avatar';
import { PageTitle } from '../shared/PageTitle';
import { actions } from '../../redux/modules/about';

const AboutComponent = ({ space, about, loading }) => (
  <div className="about-container">
    <PageTitle parts={['About']} />
    {!loading && (
      <div className="about-content pane">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to="/">home</Link> /
            </h3>
            <h1>About My Space</h1>
          </div>
        </div>

        <h2 className="section-title">General</h2>
        <div className="details-wrapper">
          <div className="row">
            <div className="col">
              <dl>
                <dt>Space Name</dt>
                <dd>{space.name}</dd>
              </dl>
            </div>
            <div className="col">
              <dl>
                <dt>User Base</dt>
                <dd>
                  {about.numberOfUsers} users in {about.numberOfTeams} teams
                </dd>
              </dl>
            </div>
            <div className="col">
              <dl>
                <dt>Created At</dt>
                <dd>
                  <TimeAgo timestamp={space.createdAt} id={space.slug} />
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <h2 className="section-title">Space Admins</h2>
        <div className="space-admin-wrapper">
          <table className="table">
            <thead>
              <tr className="header">
                <th />
                <th>Email</th>
                <th>Display Name</th>
              </tr>
            </thead>
            <tbody>
              {about.spaceAdmins.map(user => (
                <tr key={user.username}>
                  <td>
                    <Avatar user={user} />
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
        </div>
      </div>
    )}
  </div>
);

const mapStateToProps = ({ kinops, about }) => ({
  space: kinops.space,
  about: about.data,
  loading: about.loading,
});

const mapDispatchToProps = {
  fetchAbout: actions.fetchAbout,
};

export const About = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchAbout();
    },
  }),
)(AboutComponent);
