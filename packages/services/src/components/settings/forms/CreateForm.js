import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { actions } from '../../../redux/modules/settingsForms';
import { actions as servicesActions } from '../../../redux/modules/settingsServices';

export const teamOptions = teams => {
  let optionElements = '<option></option>';
  let options;
  options = teams.filter(team => !team.name.includes('Role')).map(team => {
    return { value: team.name, label: team.name };
  });
  optionElements = options.map(option => {
    return (
      <option key={option.value} value={option.value}>
        Teams > {option.label}
      </option>
    );
  });
  return optionElements;
};

export const validateForm = inputs => {
  const error = ' is a required field.';
  const validate = ['Template to Clone', 'Name', 'Slug', 'Owning Team'];
  const notValidated = validate.filter(field => inputs[field] === undefined);
  return notValidated;
};

export const CreateFormComponent = ({
  templateForms,
  loading,
  setInputs,
  setSlugEntered,
  slugEntered,
  servicesSettings: {
    loading: loadingServices,
    loadingTeams,
    teams,
    servicesSettingsKapp,
    loadingForm,
    form,
  },
  inputs,
  kappSlug,
  createForm,
  push,
  clone,
}) =>
  !loading &&
  !loadingTeams &&
  !loadingServices &&
  (!clone || !loadingForm) && (
    <div className="page-container page-container--datastore">
      <div className="page-panel page-panel--scrollable page-panel--datastore-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/kapps/services">services</Link> /{` `}
              <Link to="/kapps/services/settings">settings</Link> /{` `}
            </h3>
            <h1>{clone ? 'Clone' : 'New'} Form</h1>
          </div>
        </div>

        <section>
          <form>
            <div className="form-group">
              <label>{clone ? 'Form' : 'Template'} to Clone</label>
              {clone ? (
                form.name
              ) : (
                <select
                  className="form-control col-8"
                  name="Template to Clone"
                  value={inputs['Template to Clone'] || ''}
                  onChange={event =>
                    setInputs({
                      ...inputs,
                      'Template to Clone': event.target.value,
                    })
                  }
                  required="true"
                >
                  <option />
                  {templateForms.map(form => (
                    <option key={form.slug} value={form.slug}>
                      {form.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control col-8"
                name="Name"
                value={inputs.Name || ''}
                type="text"
                onChange={event => {
                  if (slugEntered) {
                    setInputs({
                      ...inputs,
                      Name: event.target.value,
                    });
                  } else {
                    setInputs({
                      ...inputs,
                      Name: event.target.value,
                      Slug: event.target.value
                        .toLowerCase()
                        .replace(/'/g, '')
                        .replace(/ /g, '-'),
                    });
                  }
                }}
                required="true"
              />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input
                className="form-control col-8"
                name="Slug"
                value={inputs.Slug || ''}
                type="text"
                onChange={event =>
                  setInputs({ ...inputs, Slug: event.target.value })
                }
                onKeyUp={() => setSlugEntered(true)}
                required="true"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control col-8"
                name="Description"
                value={inputs.Description || ''}
                type="text"
                onChange={event =>
                  setInputs({
                    ...inputs,
                    Description: event.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                className="form-control col-8"
                name="Type"
                value={inputs.Type || ''}
                onChange={event =>
                  setInputs({ ...inputs, Type: event.target.value })
                }
              >
                {servicesSettingsKapp.formTypes.map(type => (
                  <option key={type.name} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control col-8"
                name="Status"
                value={inputs.Status || ''}
                onChange={event =>
                  setInputs({ ...inputs, Status: event.target.value })
                }
              >
                <option>New</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Delete</option>
              </select>
            </div>
            <div className="form-group">
              <label>Owning Team</label>
              <select
                className="form-control col-8"
                name="Owning Team"
                value={inputs['Owning Team'] || []}
                onChange={event => {
                  const options = event.target.options;
                  let value = [];
                  for (let i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                      value.push(options[i].value);
                    }
                  }
                  setInputs({ ...inputs, 'Owning Team': value });
                }}
                multiple="true"
                required="true"
              >
                {teamOptions(teams)}
              </select>
            </div>
          </form>
          <div className="form__footer">
            <span className="form__footer__right">
              <Link
                to="/kapps/services/settings/forms"
                className="btn btn-link mb-0"
              >
                Cancel
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const notValidated = validateForm(inputs);
                  notValidated.length > 0
                    ? alert(notValidated[0] + ' is a required field.')
                    : createForm({
                        inputs,
                        kappSlug,
                        callback: slug =>
                          push(
                            `/kapps/services/settings/forms/${slug}/settings`,
                          ),
                      });
                }}
              >
                {clone ? 'Clone Form' : 'Create Form'}
              </button>
            </span>
          </div>
        </section>
      </div>
    </div>
  );

export const mapStateToProps = (state, { match: { params } }) => ({
  loading: state.services.forms.loading,
  templateForms: state.services.forms.data.filter(
    form => form.type === 'Template',
  ),
  servicesSettings: state.services.servicesSettings,
  kappSlug: state.app.config.kappSlug,
  clone: params.id,
});

export const mapDispatchToProps = {
  push,
  createForm: actions.createForm,
  fetchServicesSettings: servicesActions.fetchServicesSettings,
  fetchServicesSettingsTeams: servicesActions.fetchServicesSettingsTeams,
  fetchForm: servicesActions.fetchForm,
};

export const CreateForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inputs', 'setInputs', { Type: 'Service', Status: 'Active' }),
  withState('slugEntered', 'setSlugEntered', false),
  withHandlers({ teamOptions, validateForm }),
  lifecycle({
    componentWillMount() {
      this.props.clone &&
        this.props.fetchForm({
          kappSlug: 'services',
          formSlug: this.props.clone,
        }) &&
        this.props.setInputs({
          ...this.props.inputs,
          'Template to Clone': this.props.clone,
        });
      this.props.fetchServicesSettings();
      this.props.fetchServicesSettingsTeams();
    },
  }),
)(CreateFormComponent);
