import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { I18n } from '@kineticdata/react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { is, fromJS, List, Map } from 'immutable';
import { PageTitle } from '../../shared/PageTitle';
import { actions } from '../../../redux/modules/settingsCategories';
import { connect } from '../../../redux/store';
import * as constants from '../../../constants';

export const CategoriesComponent = ({
  categoryHelper,
  categoryTree,
  onChange,
  onSave,
  dirty,
  reset,
  openDropdown,
  toggleDropdown,
  handleDelete,
}) => (
  <Fragment>
    <PageTitle parts={['Space Settings']} />
    <div className="page-container">
      <div className="page-panel page-panel--white page-panel--flex page-panel--no-padding">
        <div className="page-panel__header px-4">
          <div className="page-title">
            <div
              role="navigation"
              aria-label="breadcrumbs"
              className="page-title__breadcrumbs"
            >
              <span className="breadcrumb-item">
                <Link to="../..">
                  <I18n>services</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <span className="breadcrumb-item">
                <Link to="..">
                  <I18n>settings</I18n>
                </Link>{' '}
              </span>
              <span aria-hidden="true">/ </span>
              <h1>
                <I18n>Categories</I18n>
              </h1>
            </div>
            <div className="page-title__actions">
              <Link to={'new'} className="btn btn-primary">
                <span className="fa fa-fw fa-plus" />Add Category
              </Link>
            </div>
          </div>
        </div>
        <div className="page-panel__body">
          {categoryTree && (
            <SortableTree
              treeData={categoryTree}
              onChange={onChange}
              getNodeKey={({ node }) => node.slug}
              generateNodeProps={category => ({
                title: (
                  <Fragment>
                    <Link to={category.node.slug}>
                      <span className={`fa fa-fw fa-${category.node.icon}`} />{' '}
                      {category.node.name}
                    </Link>{' '}
                    {category.node.hidden && (
                      <span
                        className="fa fa-fw fa-eye-slash text-muted"
                        title="Hidden"
                      />
                    )}
                  </Fragment>
                ),
                buttons: [
                  <Dropdown
                    toggle={toggleDropdown(category.node.slug)}
                    isOpen={openDropdown === category.node.slug}
                  >
                    <DropdownToggle color="link" className="btn-sm">
                      <span className="fa fa-ellipsis-h fa-2x" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to={`new/${category.node.slug}`}>
                        <I18n>Add Subcategory</I18n>
                      </DropdownItem>
                      <DropdownItem
                        onClick={handleDelete(category.node.slug)}
                        className="text-danger"
                      >
                        <I18n>Delete</I18n> <I18n>{category.node.name}</I18n>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>,
                ],
              })}
            />
          )}
        </div>
        <div className="page-panel__footer p-4 d-flex justify-content-between">
          <div className="ml-auto">
            <button
              type="button"
              className="btn btn-success"
              disabled={!dirty}
              onClick={onSave}
            >
              <span className="fa fa-check fa-fw" />Save
            </button>
            <button
              type="button"
              className="btn btn-link"
              disabled={!dirty}
              onClick={reset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

const buildCategoryTree = categories => {
  return categories.map(category =>
    Map({
      name: category.name,
      slug: category.slug,
      expanded: true,
      sortOrder: category.sortOrder,
      parentSlug: category.parentSlug,
      icon: category.icon,
      hidden: category.hidden,
      children: buildCategoryTree(category.getChildren()),
    }),
  );
};

const mapStateToProps = state => ({
  categoryHelper: state.settingsCategories.categoryHelper,
});

const mapDispatchToProps = {
  fetchCategoriesRequest: actions.fetchCategoriesRequest,
  updateCategoriesRequest: actions.updateCategoriesRequest,
};

const updateTreeHierarchy = (tree, parentSlug) =>
  tree.map((category, index) => ({
    ...category,
    parentSlug,
    sortOrder: index,
    children: updateTreeHierarchy(category.children, category.slug),
  }));

const removeFromTree = (tree, slugToRemove) =>
  tree
    .map((category, index) => ({
      ...category,
      children: removeFromTree(category.children, slugToRemove),
    }))
    .filter(category => category.slug !== slugToRemove);

const serializeTreeHierarchy = tree =>
  List(tree)
    .flatMap(category => [
      {
        name: category.name,
        slug: category.slug,
        attributesMap: {
          [constants.ATTRIBUTE_PARENT]: category.parentSlug
            ? [category.parentSlug]
            : [],
          [constants.ATTRIBUTE_ORDER]: [`${category.sortOrder}`],
        },
      },
      ...serializeTreeHierarchy(category.children),
    ])
    .toJS();

export const Categories = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withState('categoryTree', 'setCategoryTree', null),
  withState('dirty', 'setDirty', false),
  withProps(props => ({
    originalCategoryTree: props.categoryHelper
      ? buildCategoryTree(props.categoryHelper.getRootCategories())
      : null,
  })),
  withHandlers({
    toggleDropdown: ({ openDropdown, setOpenDropdown }) => dropdownSlug => () =>
      setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug),
    onChange: ({ setCategoryTree }) => newTree =>
      setCategoryTree(updateTreeHierarchy(newTree)),
    onSave: ({ categoryTree, updateCategoriesRequest }) => () =>
      updateCategoriesRequest(serializeTreeHierarchy(categoryTree)),
    reset: ({ setCategoryTree, originalCategoryTree }) => () =>
      originalCategoryTree && setCategoryTree(originalCategoryTree.toJS()),
    handleDelete: ({ categoryTree, setCategoryTree }) => slug => () =>
      setCategoryTree(removeFromTree(categoryTree, slug)),
  }),
  lifecycle({
    componentDidMount() {
      if (this.props.originalCategoryTree && !this.props.categoryTree) {
        // Set categoryTree into state if it's not there and is ready
        this.props.setCategoryTree(this.props.originalCategoryTree.toJS());
      }
    },
    componentDidUpdate(prevProps) {
      if (this.props.originalCategoryTree && !this.props.categoryTree) {
        // Set categoryTree into state if it's not there and is ready
        this.props.setCategoryTree(this.props.originalCategoryTree.toJS());
      } else if (
        this.props.originalCategoryTree &&
        prevProps.originalCategoryTree &&
        !is(this.props.originalCategoryTree, prevProps.originalCategoryTree)
      ) {
        // If originalCategoryTree changed, update the state version
        this.props.setCategoryTree(this.props.originalCategoryTree.toJS());
      }

      if (this.props.categoryTree) {
        if (
          !this.props.dirty &&
          !is(fromJS(this.props.categoryTree), this.props.originalCategoryTree)
        ) {
          this.props.setDirty(true);
        }
        if (
          this.props.dirty &&
          is(fromJS(this.props.categoryTree), this.props.originalCategoryTree)
        ) {
          this.props.setDirty(false);
        }
      }
    },
  }),
)(CategoriesComponent);
