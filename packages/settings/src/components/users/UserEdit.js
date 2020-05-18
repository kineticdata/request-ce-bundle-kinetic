import React, { Fragment } from 'react';
import { UserForm as UserFormLib, I18n, fetchUser } from '@kineticdata/react';
import { FormComponents, ProfileCard, addToast } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { Link } from '@reach/router';
import { getIn } from 'immutable';

const asArray = value => (value ? [value] : []);

const handleSave = () => ({ user }) => {
  addToast(`${user.username} updated successfully.`);
};

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
      <div className="col-12">
        <h5>Profile Attributes</h5>
        {fields.get('firstName')}
        {fields.get('lastName')}
        {fields.get('phoneNumber')}
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-12">
        <h5>User Attributes</h5>
        {fields.get('department')}
        {fields.get('manager')}
        {fields.get('organization')}
        {fields.get('site')}
      </div>
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

export const UserEdit = ({ formKey, username, onDelete }) => (
  <div className="page-container page-container--panels">
    <PageTitle parts={[`Edit User`, 'Users']} />
    <UserFormLib
      formkey={`user-edit`}
      username={username ? username : null}
      components={{
        FormError: FormComponents.FormError,
        FormButtons: FormComponents.generateFormButtons({
          handleDelete: onDelete,
          submitLabel: 'Update User',
          cancelPath: '/settings/users',
        }),
        FormLayout: layout,
      }}
      addFields={() => ({ user }) =>
        user && [
          {
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            initialValue: user.getIn(['profileAttributesMap', 'First Name', 0]),
          },
          {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            initialValue: user.getIn(['profileAttributesMap', 'Last Name', 0]),
          },
          {
            name: 'phoneNumber',
            label: 'Phone Number',
            type: 'text',
            initialValue: user.getIn([
              'profileAttributesMap',
              'Phone Number',
              0,
            ]),
          },
          {
            name: 'department',
            label: 'Department',
            type: 'text',
            initialValue: user.getIn(['attributesMap', 'Last Name', 0]),
          },
          {
            name: 'manager',
            label: 'Manager',
            type: 'text',
            initialValue: user.getIn(['attributesMap', 'Manager', 0]),
          },
          {
            name: 'organization',
            label: 'Organization',
            type: 'text',
            initialValue: user.getIn(['attributesMap', 'Organization', 0]),
          },
          {
            name: 'site',
            label: 'Site',
            type: 'text',
            initialValue: user.getIn(['attributesMap', 'Site', 0]),
          },
        ]}
      alterFields={{
        profileAttributesMap: {
          serialize: ({ values }) => ({
            'First Name': asArray(values.get('firstName')),
            'Last Name': asArray(values.get('lastName')),
            'Phone Number': asArray(values.get('phoneNumber')),
          }),
        },
        attributesMap: {
          serialize: ({ values }) => ({
            Department: asArray(values.get('department')),
            Manager: asArray(values.get('manager')),
            Organization: asArray(values.get('organization')),
            Site: asArray(values.get('site')),
          }),
        },
      }}
      addDataSources={
        username
          ? {
              user: {
                fn: fetchUser,
                params: [{ username: username }],
                // Set to the user, or the result in case of an error
                transform: result => result.user || result,
              },
            }
          : undefined
      }
      onSave={handleSave}
    >
      {({ form, bindings: { form: formBindings }, initialized, user }) =>
        initialized && (
          <Fragment>
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
                    <I18n>Edit User</I18n>
                  </h1>
                </div>
              </div>
              {form}
            </div>
            <div className="page-panel page-panel--one-thirds page-panel--sidebar">
              <Fragment>
                <br />
                <ProfileCard
                  user={buildProfile(
                    getIn(form, ['props', 'bindings', 'user'], []).toJS(),
                  )}
                />
              </Fragment>
            </div>
          </Fragment>
        )
      }
    </UserFormLib>
  </div>
);
