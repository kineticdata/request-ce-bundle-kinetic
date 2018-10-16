import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { Utils, PageTitle } from 'common';
import { Modal } from 'reactstrap';
import SortableTree, {
  removeNode,
  removeNodeAtPath,
  getNodeAtPath,
  addNodeUnderParent,
  getFlatDataFromTree,
  changeNodeAtPath,
} from 'react-sortable-tree';
import axios from 'axios';
import 'react-sortable-tree/style.css';
import { actions } from '../../../redux/modules/settingsCategories';
import { setInitialInputs } from '../forms/FormSettings';

/**
 * AXIOS Calls
 * */
const addCategory = ({ name, slug, sort, parent }) => {
  const data = {
    name,
    slug,
    attributes: [
      {
        name: 'Sort Order',
        values: [sort],
      },
    ],
  };

  if (parent != null) {
    data.attributes.push({
      name: 'Parent',
      values: [parent],
    });
  }

  return axios.request({
    method: 'post',
    url: `${bundle.apiLocation()}/kapps/services/categories/`,
    data,
    contentType: 'application/json; charset=utf-8',
  });
};

// Delete Category
export const deleteCategory = ({ slug }) => {
  return axios.request({
    method: 'delete',
    url: `${bundle.apiLocation()}/kapps/services/categories/${slug}`,
    contentType: 'application/json; charset=utf-8',
  });
};

// Update Category
export const updateCategory = ({ name, slug, sort, parent, originalSlug }) => {
  const data = {
    name: name,
    slug: slug,
    attributesMap: {
      'Sort Order': [sort],
      Parent: [parent],
    },
  };
  return axios.request({
    method: 'put',
    url: `${bundle.apiLocation()}/kapps/services/categories/${
      originalSlug ? originalSlug : slug
    }`,
    data: JSON.stringify(data),
  });
};

/**
 * Functions for tree
 * */

// Map categories
export const mapCatgories = ({ rawCategories, setCategories }) => () => {
  rawCategories.sort(function(a, b) {
    a.attributes = a.attributes || {};
    a.attributes['Sort Order'] = a.attributes['Sort Order'] || [0];
    b.attributes = b.attributes || {};
    b.attributes['Sort Order'] = b.attributes['Sort Order'] || [0];
    return a.attributes['Sort Order'][0] > b.attributes['Sort Order'][0]
      ? 1
      : b.attributes['Sort Order'][0] > a.attributes['Sort Order'][0]
        ? -1
        : 0;
  });
  const mapped = {};
  for (let i = 0; i < rawCategories.length; i++) {
    const slug = rawCategories[i].slug;
    const cat = mapped[slug] || {};
    cat.children = cat.children || [];
    cat.slug = rawCategories[i].slug;
    cat.name = rawCategories[i].name;
    cat.title = rawCategories[i].name;
    cat.sort = rawCategories[i].attributes['Sort Order'][0];
    const parent = rawCategories[i].attributes.Parent;
    if (parent && parent[0] !== '') {
      mapped[parent] = mapped[parent] || {};
      mapped[parent].children = mapped[parent].children || [];
      mapped[parent].children.push(cat);
      mapped[parent].children.sort(function(a, b) {
        a.attributes = a.attributes || {};
        a.attributes['Sort Order'] = a.attributes['Sort Order'] || [0];
        b.attributes = b.attributes || {};
        b.attributes['Sort Order'] = b.attributes['Sort Order'] || [0];
        return a.sort[0] > b.sort[0] ? 1 : b.sort[0] > a.sort[0] ? -1 : 0;
      });
    } else {
      mapped[slug] = cat;
    }
  }
  const treeData = Object.values(mapped);
  setCategories(treeData);
};

// Remove category
export const removeCategory = ({ categories, setCategories }) => rowInfo => {
  if (
    confirm(
      'Are you sure you want to remove this category and all subcategories?',
    )
  ) {
    let { node, treeIndex, path } = rowInfo;
    const newTree = removeNodeAtPath({
      treeData: categories,
      path: path, // You can use path from here
      getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
        return number;
      },
      ignoreCollapsed: true,
    });
    deleteCategory({ slug: rowInfo.node.slug })
      .then(response => {
        const flatTree = getFlatDataFromTree({
          treeData: categories,
          getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
            return number;
          },
          ignoreCollapsed: false,
        });

        // Remove node and all nested children
        const parents = [];
        parents.push(node.slug);
        for (let i = 0; i < flatTree.length; i++) {
          const currentNode = flatTree[i];
          if (
            currentNode.parentNode &&
            parents.includes(currentNode.parentNode.slug)
          ) {
            parents.push(currentNode.node.slug);
            deleteCategory({ slug: currentNode.node.slug }).catch(response =>
              console.log(response),
            );
          }
        }
        setCategories(newTree);
      })
      .catch(response => console.log(response));
  }
};

// Add subcategory
export const addSubCategory = ({
  categories,
  setCategories,
  subcategory,
  setSubcategory,
}) => rowInfo => {
  // Check for inputs
  if (!subcategory.name || !subcategory.slug) {
    setInputs({ ...subcategory, error: 'All fields are required.' });
    return false;
  }
  // Check for preexisting slug
  const flatTree = getFlatDataFromTree({
    treeData: categories,
    getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
      return number;
    },
    ignoreCollapsed: false,
  });

  const matches = flatTree.filter(cat => {
    return cat.node.slug === subcategory.slug;
  });

  if (matches.length > 0) {
    setSubcategory({ ...subcategory, error: 'Category slug already exists.' });
    return false;
  }

  // Get new node with tree info
  let NEW_NODE = { title: subcategory.name, slug: subcategory.slug };
  let { node, treeIndex, path } = rowInfo;
  let parentNode = getNodeAtPath({
    treeData: categories,
    path: path,
    getNodeKey: ({ treeIndex }) => treeIndex,
    ignoreCollapsed: true,
  });

  let getNodeKey = ({ node: object, treeIndex: number }) => {
    return number;
  };
  let parentKey = getNodeKey(parentNode);
  if (parentKey == -1) {
    parentKey = null;
  }
  let newTree = addNodeUnderParent({
    treeData: categories,
    newNode: NEW_NODE,
    expandParent: true,
    parentKey: parentKey,
    getNodeKey: ({ treeIndex }) => treeIndex,
  });

  // Add subcategory
  addCategory({
    name: subcategory.name,
    slug: subcategory.slug,
    sort: rowInfo.treeIndex,
    parent: parentNode.node.slug,
  })
    .then(response => {
      setCategories(newTree.treeData);
      setSubcategory({});
    })
    .catch(response => {
      setSubcategory({ ...subcategory, error: 'There was an error ' });
    });
};

// Add New Category
export const addNewCategory = ({
  categories,
  setCategories,
  inputs,
  setSlugEntered,
  setInputs,
}) => () => {
  // Set loading
  setInputs({ ...inputs, loading: true });
  // Check for inputs
  if (!inputs.category || !inputs.slug) {
    setInputs({ ...inputs, error: 'All fields are required.', loading: false });
    return false;
  }
  // Check for preexisting slug
  const flatTree = getFlatDataFromTree({
    treeData: categories,
    getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
      return number;
    },
    ignoreCollapsed: false,
  });

  const matches = flatTree.filter(cat => {
    return cat.node.slug === inputs.slug;
  });

  if (matches.length > 0) {
    setInputs({
      ...inputs,
      error: 'Category slug already exists.',
      loading: false,
    });
    return false;
  }

  // Get new node info
  let NEW_NODE = { title: inputs.category, slug: inputs.slug };
  let parentKey = null;

  let newTree = addNodeUnderParent({
    treeData: categories,
    newNode: NEW_NODE,
    expandParent: true,
    parentKey: parentKey,
    getNodeKey: ({ treeIndex }) => treeIndex,
    ignoreCollapsed: false,
  });

  addCategory({
    name: inputs.category,
    slug: inputs.slug,
    sort: categories.length + 1,
  })
    .then(response => {
      setCategories(newTree.treeData);
      setSlugEntered(false);
      setInputs({ category: '', slug: '', loading: false });
    })
    .catch(response => {
      setInputs({ ...inputs, error: 'There was an error: ' + response });
    });
};

// Edit name / slug of category
export const editCategory = ({
  categories,
  subcategory,
  setSubcategory,
  setCategories,
}) => rowInfo => {
  let { node, treeIndex, path } = rowInfo;

  const name = subcategory.name;
  const title = subcategory.name;
  const slug = subcategory.slug;

  updateCategory({
    name: name,
    slug: slug,
    sort: treeIndex,
    parent: null,
    originalSlug: node.slug,
  })
    .then(response => {
      const newTree = changeNodeAtPath({
        treeData: categories,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: { ...node, title, name, slug },
      });
      setCategories(newTree);
      setSubcategory({});
    })
    .catch(response =>
      setSubcategory({ ...subcategory, error: 'There was an error ' }),
    );
};

// Update the order of categories
export const updateCategoryOrder = ({ setCategories }) => args => {
  // get flat tree
  const flatTree = getFlatDataFromTree({
    treeData: args.treeData,
    getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
      return number;
    },
    ignoreCollapsed: false,
  });

  // reorder categories
  for (let i = 0; i < flatTree.length; i++) {
    const currentNode = flatTree[i];

    updateCategory({
      name: currentNode.node.name,
      slug: currentNode.node.slug,
      sort: i,
      parent: currentNode.parentNode ? currentNode.parentNode.slug : null,
    })
      .then(response => setCategories(args.treeData))
      .catch(response => console.log(response));
  }
};

export const isBlank = string => !string || string.trim().length === 0;

/**
 * Render
 * */

export const CategoriesContainer = ({
  updateCategoryOrder,
  categories,
  catLoading,
  setCategories,
  removeCategory,
  addNewCategory,
  addSubCategory,
  inputs,
  setInputs,
  slugEntered,
  setSlugEntered,
  subcategory,
  setSubcategory,
  editCategory,
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
        <section className="row">
          <div className="col-sm-6 sortable-categories">
            <SortableTree
              treeData={categories}
              onChange={treeData => setCategories(treeData)}
              getNodeKey={categories.slug}
              onMoveNode={args => updateCategoryOrder(args)}
              generateNodeProps={rowInfo => ({
                buttons: [
                  <div>
                    <span
                      className="fa fa-pencil fa-lg"
                      label="Edit"
                      onClick={event =>
                        setSubcategory({
                          ...subcategory,
                          rowInfo: rowInfo,
                          name: rowInfo.node.name,
                          slug: rowInfo.node.slug,
                          action: 'edit',
                        })
                      }
                    />

                    <span
                      className="fa fa-plus-circle fa-lg"
                      label="Add Subcategory"
                      onClick={event =>
                        setSubcategory({ ...subcategory, rowInfo: rowInfo })
                      }
                    />

                    <span
                      className="fa fa-times-circle fa-lg"
                      label="Delete"
                      onClick={event => removeCategory(rowInfo)}
                    />
                  </div>,
                ],
              })}
            />
          </div>
          <div className="col-sm-6">
            <h3>New Category</h3>
            <form>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  name="category"
                  value={inputs.category}
                  id="category-name"
                  type="text"
                  onChange={event => {
                    if (slugEntered) {
                      setInputs({
                        ...inputs,
                        category: event.target.value
                          .toLowerCase()
                          .replace(/'/g, '')
                          .replace(/ /g, '-'),
                      });
                    } else {
                      setInputs({
                        ...inputs,
                        category: event.target.value,
                        slug: event.target.value
                          .toLowerCase()
                          .replace(/'/g, '')
                          .replace(/ /g, '-'),
                      });
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label>Category Slug</label>
                <input
                  name="category-slug"
                  value={inputs.slug}
                  id="category-slug"
                  type="text"
                  onChange={event =>
                    setInputs({ ...inputs, slug: event.target.value })
                  }
                  onKeyUp={() => setSlugEntered(true)}
                />
              </div>
              {inputs.error && (
                <div className="alert alert-danger">{inputs.error}</div>
              )}
              <div
                className="btn btn-primary"
                onClick={addNewCategory}
                disabled={inputs.loading}
              >
                Create Category
              </div>
            </form>
          </div>
        </section>

        {!!subcategory.rowInfo && (
          <Modal
            size="md"
            isOpen={!!subcategory.rowInfo}
            toggle={() => setSubcategory({})}
          >
            <div className="modal-header">
              <h4 className="modal-title">
                <button
                  onClick={() => setSubcategory({})}
                  type="button"
                  className="btn btn-link"
                >
                  Cancel
                </button>
                <span>Subcategory</span>
              </h4>
            </div>
            <div className="modal-body">
              <div className="modal-form">
                <div className="form-group required">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    onChange={event => {
                      if (slugEntered) {
                        setSubcategory({
                          ...subcategory,
                          name: event.target.value
                            .toLowerCase()
                            .replace(/'/g, '')
                            .replace(/ /g, '-'),
                        });
                      } else {
                        setSubcategory({
                          ...subcategory,
                          name: event.target.value,
                          slug: event.target.value
                            .toLowerCase()
                            .replace(/'/g, '')
                            .replace(/ /g, '-'),
                        });
                      }
                    }}
                    value={subcategory.name}
                    className="form-control"
                  />
                </div>
                <div className="form-group required">
                  <label htmlFor="name">Slug</label>
                  <input
                    id="slug"
                    name="slug"
                    onChange={e =>
                      setSubcategory({ ...subcategory, slug: e.target.value })
                    }
                    onKeyUp={() => setSlugEntered(true)}
                    value={subcategory.slug}
                    className="form-control"
                  />
                </div>
                {subcategory.error && (
                  <div className="alert alert-danger">{subcategory.error}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  disabled={isBlank(subcategory.name)}
                  onClick={
                    subcategory.action === 'edit'
                      ? () => editCategory(subcategory.rowInfo)
                      : () => addSubCategory(subcategory.rowInfo)
                  }
                  type="button"
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
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
};

export const CategoriesSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('categories', 'setCategories', []),
  withState('inputs', 'setInputs', {}),
  withState('subcategory', 'setSubcategory', {}),
  withState('subcategory', 'setSubcategory', {}),
  withState('slugEntered', 'setSlugEntered', false),
  withHandlers({
    mapCatgories,
    removeCategory,
    addNewCategory,
    addSubCategory,
    updateCategoryOrder,
    editCategory,
  }),
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
