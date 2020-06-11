import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { compose, lifecycle, withHandlers } from 'recompose';
import { FormComponents, addToast } from 'common';
import { PageTitle } from '../../shared/PageTitle';
import { actions } from '../../../redux/modules/settingsCategories';
import { connect } from '../../../redux/store';
import { I18n, CategoryForm } from '@kineticdata/react';
import * as constants from '../../../constants';

const fieldSet = ['name', 'slug', 'icon', 'hidden', 'attributesMap'];

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    {fields.get('name')}
    {fields.get('slug')}
    {fields.get('icon')}
    {fields.get('hidden')}
    {error}
    {buttons}
  </Fragment>
);

const asArray = value => (value ? [value] : []);

export const CategoryComponent = ({
  currentKapp,
  slug,
  category,
  parentSlug,
  parent,
  onSave,
}) => (
  <CategoryForm
    // Set unique key to force component to reload when corresponding props change
    key={`${slug}-${parentSlug}`}
    kappSlug={currentKapp.slug}
    categorySlug={slug}
    fieldSet={fieldSet}
    onSave={onSave}
    components={{
      FormLayout,
      FormButtons: FormComponents.generateFormButtons({
        submitLabel: 'Save',
        cancelPath: parent ? '../..' : '..',
      }),
    }}
    addFields={() => ({ category }) => [
      {
        name: 'icon',
        label: 'Display Icon',
        type: 'text',
        helpText: 'Font Awesome icon to display in in category cards.',
        initialValue: category
          ? category.getIn(['attributesMap', constants.ATTRIBUTE_ICON, 0])
          : '',
        component: FormComponents.IconField,
      },
      {
        name: 'hidden',
        label: 'Hidden',
        type: 'checkbox',
        helpText: 'Should this category be hidden from users.',
        initialValue: category
          ? category.getIn(['attributesMap', constants.ATTRIBUTE_HIDDEN, 0]) ===
            'True'
          : false,
        component: FormComponents.CheckboxField,
      },
    ]}
    alterFields={{
      attributesMap: {
        serialize: ({ values }) => ({
          [constants.ATTRIBUTE_ICON]: asArray(values.get('icon')),
          [constants.ATTRIBUTE_HIDDEN]: asArray(
            values.get('hidden') ? 'True' : null,
          ),
          ...(!slug && parent
            ? { [constants.ATTRIBUTE_PARENT]: [parentSlug] }
            : {}),
        }),
      },
    }}
  >
    {({ form, initialized, bindings }) => {
      const pageName = slug
        ? bindings.category && bindings.category.get('name')
        : parent
          ? 'New Subcategory'
          : 'New Category';
      return (
        <div className="page-container">
          <PageTitle parts={[pageName, 'Category Settings']} />
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div
                role="navigation"
                aria-label="breadcrumbs"
                className="page-title__breadcrumbs"
              >
                <span className="breadcrumb-item">
                  <Link to={`../../..${parent ? '/..' : ''}`}>
                    <I18n>services</I18n>
                  </Link>
                </span>
                <span aria-hidden="true">/ </span>
                <span className="breadcrumb-item">
                  <Link to={`../..${parent ? '/..' : ''}`}>
                    <I18n>settings</I18n>
                  </Link>
                </span>{' '}
                <span aria-hidden="true">/ </span>
                <span className="breadcrumb-item">
                  <Link to={`..${parent ? '/..' : ''}`}>
                    <I18n>categories</I18n>
                  </Link>
                </span>{' '}
                <span aria-hidden="true">/ </span>
                {(parent
                  ? parent.getTrail()
                  : category
                    ? category.getTrail().skipLast(1)
                    : []
                ).map(ancestorCategory => (
                  <Fragment key={ancestorCategory.slug}>
                    <span className="breadcrumb-item">
                      <Link to={`../../${ancestorCategory.slug}`}>
                        <I18n>{ancestorCategory.name}</I18n>
                      </Link>
                    </span>{' '}
                    <span aria-hidden="true">/ </span>
                  </Fragment>
                ))}
                <h1>
                  <I18n>{pageName}</I18n>
                </h1>
              </div>
              {initialized &&
                slug && (
                  <div className="page-title__actions">
                    <Link to={`../new/${slug}`} className="btn btn-primary">
                      <span className="fa fa-fw fa-plus" />Add Subcategory
                    </Link>
                  </div>
                )}
            </div>
            {initialized && <section className="form">{form}</section>}
          </div>
        </div>
      );
    }}
  </CategoryForm>
);

const mapStateToProps = (state, props) => {
  const categoryHelper = state.settingsCategories.categoryHelper;
  return {
    category: categoryHelper && categoryHelper.getCategory(props.slug),
    parent: categoryHelper && categoryHelper.getCategory(props.parentSlug),
    currentKapp: state.app.kapp,
    reloadApp: state.app.actions.refreshApp,
  };
};

const mapDispatchToProps = {
  fetchCategoriesRequest: actions.fetchCategoriesRequest,
};

export const Category = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    onSave: props => () => () => {
      props.reloadApp();
      props.fetchCategoriesRequest();
      addToast(`Category saved successfully.`);
      props.navigate(props.parent ? '../..' : '..');
    },
  }),
  lifecycle({
    componentDidMount() {},
    componentDidUpdate(prevProps) {},
    componentWillUnmount() {},
  }),
)(CategoryComponent);
