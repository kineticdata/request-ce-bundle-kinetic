import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Record } from 'immutable';
import { PeopleSelect } from './PeopleSelect';
import { updateDiscussion } from '../discussion_api';

const Values = Record({
  title: '',
  description: '',
  isPrivate: false,
  owningUsers: [],
  owningTeams: [],
});

export class DiscussionEditFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: Values(props.discussion),
      dirty: false,
      saving: false,
      error: null,
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    updateDiscussion(
      this.props.discussion.id,
      this.state.values,
      this.props.token,
    ).then(response => {
      this.setState({
        saving: false,
        dirty: false,
        error: response.error ? response.error.response.data.message : null,
      });
    });
  };

  handleChange = event => {
    const field = event.target.id;
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    this.setState(state => ({
      ...state,
      values: state.values.set(field, value),
      dirty: true,
    }));
  };

  render() {
    return (
      <Fragment>
        <ModalBody>
          <div className="modal-form">
            <form onSubmit={this.handleSubmit}>
              {this.state.error && (
                <p className="alert alert-danger">{this.state.error}</p>
              )}
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={this.state.values.title}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={this.state.values.description}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group form-check-inline">
                <input
                  className="form-check-input"
                  id="isPrivate"
                  type="checkbox"
                  checked={this.state.values.isPrivate}
                  onChange={this.handleChange}
                />
                <label className="form-check-label" htmlFor="isPrivate">
                  Private?
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="owningUsers">Owning Users</label>
                <PeopleSelect
                  id="owningUsers"
                  users
                  value={this.state.values.owningUsers}
                  valueMapper={value => ({ username: value.user.username })}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="owningTeams">Owning Teams</label>
                <PeopleSelect
                  id="owningTeams"
                  teams
                  value={this.state.values.owningTeams}
                  valueMapper={value => ({ name: value.team.name })}
                  onChange={this.handleChange}
                />
              </div>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            type="button"
            disabled={!this.state.dirty || this.state.saving}
            onClick={this.handleSubmit}
          >
            Save
          </button>
        </ModalFooter>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.discussions.socket.token,
});

export const DiscussionEditForm = connect(mapStateToProps)(
  DiscussionEditFormComponent,
);
