import React, { Fragment } from 'react';
import { UserForm as UserFormLib, I18n, fetchUser } from '@kineticdata/react';
import { FormComponents, ProfileCard } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { Link } from '@reach/router';
import { getIn } from 'immutable';

const buildProfile = profile => ({
  ...profile,
  displayName: profile.displayName || '',
  email: profile.email || '',
  preferredLocale: profile.preferredLocale || '',
  timezone: profile.timezone || '',
  profileAttributes: profile.profileAttributes || [],
});

const layout = ({ fields, error, buttons }) => (
  <form>
    <div className="row">
      <div className="col-12">
        <h5>General</h5>
        {fields.get('spaceAdmin')}
        {fields.get('enabled')}
        {fields.get('displayName')}
        {fields.get('email')}
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-12">{fields.get('profileAttributesMap')}</div>
    </div>
    <hr />
    <div className="row">
      <div className="col-12">{fields.get('attributesMap')}</div>
    </div>
    <hr />
    <div className="row">
      <div className="col-12">
        <h5>Membership</h5>
        {fields.get('memberships')}
      </div>
    </div>
    {error}
    <hr />
    <div className="row">
      <div className="col-12 form-buttons ">{buttons}</div>
    </div>
  </form>
);

export const UserForm = ({ formKey, username, onSave, onDelete, mode }) => (
  <div className="page-container page-container--panels">
    <PageTitle
      parts={[username && mode === 'edit' ? `Edit User` : 'New', 'Users']}
    />
    <UserFormLib
      formkey={`user-${mode}`}
      username={username && mode === 'edit' ? username : null}
      alterFields={{
        displayName: mode !== 'edit' && {
          initialValue: '',
        },
        email: mode !== 'edit' && {
          initialValue: '',
        },
      }}
      components={{
        FormError: FormComponents.FormError,
        FormButtons: FormComponents.generateFormButtons({
          handleDelete: onDelete,
          submitLabel:
            username && mode === 'edit' ? 'Update User' : 'Create User',
          cancelPath: '/settings/users',
        }),
        FormLayout: layout,
      }}
      addDataSources={
        username
          ? {
              user: {
                fn: fetchUser,
                params: [{ username: username }],
                // Set to the form, or the result in case of an error
                transform: result => result.user || result,
              },
            }
          : undefined
      }
      onSave={onSave}
    >
      {({ form, bindings: { form: formBindings }, initialized, user }) =>
        initialized && (
          <Fragment>
            {console.log('user:', user)}
            <div className="page-panel page-panel--two-thirds page-panel--white">
              <div className="page-title">
                <div className="page-title__wrapper">
                  <h3>
                    <Link to="/settings">
                      <I18n>settings</I18n>
                    </Link>{' '}
                    /{' '}
                    <Link to="/settings/users">
                      <I18n>users</I18n>
                    </Link>{' '}
                    /
                  </h3>
                  <h1>
                    <I18n>
                      {username && mode === 'edit' ? 'Edit' : 'New'} User
                    </I18n>
                  </h1>
                </div>
              </div>
              {form}
            </div>
            <div className="page-panel page-panel--one-thirds page-panel--sidebar">
              {username ? (
                mode === 'edit' && (
                  <Fragment>
                    <br />
                    <ProfileCard
                      user={buildProfile(
                        getIn(form, ['props', 'bindings', 'user'], []).toJS(),
                      )}
                    />
                  </Fragment>
                )
              ) : (
                <Fragment>
                  <h3>
                    <I18n>New User</I18n>
                  </h3>
                  <p>
                    <I18n>
                      Users are the platform representation of individuals. They
                      can have attributes and profile attributes, which can be
                      defined per space, and they can also be members of teams.
                    </I18n>
                  </p>
                  <p>
                    <I18n>
                      Attributes are only modifiable by space admins and are
                      typically used to store variables that a user can not
                      change (e.g. Manager).
                    </I18n>
                  </p>
                  <p>
                    <I18n>
                      Profile Attributes are typically used to store variables
                      that the user has access to change (e.g. Phone Number).
                    </I18n>
                  </p>
                  <p>
                    <I18n>
                      Teams are used to group users together. They are typically
                      used for creating Roles or Assignment Groups.
                    </I18n>
                  </p>
                </Fragment>
              )}
            </div>
          </Fragment>
        )
      }
    </UserFormLib>
  </div>
);
