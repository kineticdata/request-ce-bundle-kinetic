import React, { Fragment } from 'react';
import axios from 'axios';
import { bundle } from 'react-kinetic-core';

export class DiscussionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.discussion
        ? {
            title: props.discussion.title,
            description: props.discussion.description,
            isPrivate: props.discussion.isPrivate,
            joinPolicy: props.discussion.joinPolicy,
            owningUsers: props.discussion.owningUsers.toJS(),
            owningTeams: props.discussion.owningTeams.toJS(),
            isArchived: props.discussion.isArchived,
          }
        : {
            title: (props.defaults && props.defaults.title) || '',
            description: (props.defaults && props.defaults.description) || '',
            isPrivate: false,
            joinPolicy: '',
            owningUsers: (props.defaults && props.defaults.owningUsers) || [],
            owningTeams: [],
            isArchived: false,
          },
      touched: {},
      dirty: false,
      saving: false,
      editing: !!props.discussion,
      securityPolicyDefinitions: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${bundle.apiLocation()}/securityPolicyDefinitions`)
      .then(response =>
        this.setState({
          securityPolicyDefinitions: response.data.securityPolicyDefinitions,
        }),
      );
  }

  validate = values => {
    const result = {};
    if (values.title === null || values.title === '') {
      result.title = 'Title must not be empty';
    }
    return result;
  };

  submit = event => {
    event && event.preventDefault && event.preventDefault();
    this.setState({ dirty: false, saving: true });
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state.values, () =>
        this.setState({ saving: false }),
      );
    }
  };

  handleChange = event => {
    const field = event.target.id;
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    this.setState(state => ({
      ...state,
      values: { ...state.values, [field]: value },
      dirty: true,
    }));
  };

  handleBlur = event => {
    const field = event.target.id;
    this.setState(state => ({
      ...state,
      touched: { ...state.touched, [field]: true },
    }));
  };

  handleJoinPolicyChange = event => {
    const name = event.target.value;
    this.setState(state => ({
      ...state,
      values: { ...state.values, joinPolicy: name ? { name } : null },
      dirty: true,
    }));
  };

  render() {
    const OwningUsersInput = this.props.renderOwningUsersInput;
    const OwningTeamsInput = this.props.renderOwningTeamsInput;
    const validations = this.validate(this.state.values);
    return this.props.render({
      formElement: (
        <form onSubmit={this.submit}>
          <div
            className={`form-group required ${
              validations.title && this.state.touched.title ? 'has-error' : ''
            }`}
          >
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={this.state.values.title}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
            {validations.title &&
              this.state.touched.title && (
                <p className="text-danger">{validations.title}</p>
              )}
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
          <p>Private discussions require explicit invitations to join</p>
          {!this.state.values.isPrivate && (
            <div className="form-group">
              <label htmlFor="joinPolicy">Join Policy</label>
              <select
                id="joinPolicy"
                value={
                  this.state.values.joinPolicy
                    ? this.state.values.joinPolicy.name
                    : ''
                }
                onChange={this.handleJoinPolicyChange}
              >
                <option />
                {this.state.securityPolicyDefinitions.map(definition => (
                  <option value={definition.name} key={definition.name}>
                    {definition.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="owningUsers">Owning Users</label>
            <OwningUsersInput
              id="owningUsers"
              value={this.state.values.owningUsers}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="owningTeams">Owning Teams</label>
            <OwningTeamsInput
              id="owningTeams"
              value={this.state.values.owningTeams}
              onChange={this.handleChange}
            />
          </div>
          <p>
            Owning users and teams are able to make changes to the discussion
          </p>
          {this.state.editing && (
            <Fragment>
              <div className="form-group">
                <div className="form-check-inline">
                  <input
                    className="form-check-input"
                    id="isArchived"
                    type="checkbox"
                    checked={this.state.values.isArchived}
                    onChange={this.handleChange}
                  />
                  <label className="form-check-label" htmlFor="isArchived">
                    Archived?
                  </label>
                </div>
              </div>
              <p className="text-danger">
                While archived, users are not able to send any messages
              </p>
            </Fragment>
          )}
        </form>
      ),
      submit: this.submit,
      dirty: this.state.dirty,
      invalid: Object.keys(validations).length > 0,
      buttonProps: {
        onClick: this.submit,
        disabled:
          !this.state.dirty ||
          this.state.saving ||
          Object.keys(validations).length > 0,
      },
    });
  }
}
