import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { Utils, PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsCategories';

export const mapCatgories = ({ rawCategories, setCatgories }) => () => {
  const mapped = {};
  for (let i = 0; i < rawCategories.length; i++) {
    const slug = rawCategories[i].slug;
    const cat = mapped[slug] || {};
    cat.subcategories = cat.subcategories || [];
    cat.slug = rawCategories[i].slug;
    cat.name = rawCategories[i].name;

    const parent = rawCategories[i].attributes.Parent;
    if (parent) {
      mapped[parent] = mapped[parent] || {};
      mapped[parent].subcategories = mapped[parent].subcategories || [];
      mapped[parent].subcategories.push(slug);
    }

    mapped[slug] = cat;
  }
  setCatgories(mapped);
};

export const Category = ({ category, subcategories, categories }) => (
  <li key={category.slug}>
    {category.name}
    <ul className="subcat">
      {subcategories && (
        <Subcategory subcategories={subcategories} categories={categories} />
      )}
    </ul>
  </li>
);

export const Subcategory = ({ subcategories, categories }) => {
  let subcats = null;
  subcats = subcategories.map(subcategory => (
    <li key={categories[subcategory].slug}>
      {categories[subcategory].name}
      <ul className="subcat">
        {categories[subcategory].subcategories && (
          <Subcategory
            subcategories={categories[subcategory].subcategories}
            categories={categories}
          />
        )}
      </ul>
    </li>
  ));
  return subcats;
};

export const CategoriesContainer = ({
  updateCategories,
  categories,
  catLoading,
}) => (
  <div>
    <PageTitle parts={['Space Settings']} />
    <div className="page-container page-container--space-settings">
      <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/kapps/services">services</Link> /{` `}
              <Link to="/kapps/services/settings">settings</Link> /{` `}
            </h3>
            <h1>Categories</h1>
          </div>
        </div>
        <section>
          {Object.keys(categories).map((category, key) => (
            <Category
              category={categories[category]}
              categories={categories}
              subcategories={categories[category].subcategories}
              key={key}
            />
          ))}
        </section>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  rawCategories: state.services.settingsCategories.rawCategories,
  loading: state.services.settingsCategories.loading,
  kappSlug: state.app.config.kappSlug,
});

const mapDispatchToProps = {
  fetchCategories: actions.fetchCategories,
  updateCategories: actions.updateCategories,
};

export const CategoriesSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('categories', 'setCatgories', {}),
  withHandlers({ mapCatgories }),
  lifecycle({
    componentWillMount() {
      this.props.fetchCategories(this.props.kappSlug);
    },
    componentWillReceiveProps(nextProps) {
      nextProps.rawCategories !== this.props.rawCategories &&
        this.props.mapCatgories(nextProps.rawCategories);
    },
  }),
)(CategoriesContainer);
