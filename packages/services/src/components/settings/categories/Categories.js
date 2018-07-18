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
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { actions } from '../../../redux/modules/settingsCategories';
import { setInitialInputs } from '../forms/FormSettings';

// Map categories for tree
export const mapCatgories = ({ rawCategories, setCatgories }) => () => {
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
  setCatgories(treeData);
};

// Remove category
export const removeCategory = ({ categories, setCatgories }) => rowInfo => {
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
        console.log(currentNode.node.slug);
        parents.push(currentNode.node.slug);
        //deleteCategory(currentNode.node.slug);
      }
    }
    setCatgories(newTree);
  }
};

// Add subcategory
export const addSubCategory = ({
  categories,
  setCatgories,
  subcategory,
  setSubcategory,
  addCategory,
}) => rowInfo => {
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

  // Add subcategory to tree
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

  addCategory({
    name: subcategory.name,
    slug: subcategory.slug,
    sort: rowInfo.treeIndex,
    parent: parentNode.node.slug,
  });

  setCatgories(newTree.treeData);
  setSubcategory({});
};

export const addNewCategory = ({
  categories,
  setCatgories,
  inputs,
  setSlugEntered,
  setInputs,
}) => () => {
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
    setInputs({ ...inputs, error: 'Category slug already exists.' });
    return false;
  }

  let NEW_NODE = { title: inputs.category, slug: inputs.slug };
  let parentKey = null;

  let newTree = addNodeUnderParent({
    treeData: categories,
    newNode: NEW_NODE,
    expandParent: true,
    parentKey: parentKey,
    getNodeKey: ({ treeIndex }) => treeIndex,
  });
  // addCategory();
  setCatgories(newTree.treeData);
  setSlugEntered(false);
  setInputs({});
};

export const updateCategoryOrder = ({
  setCatgories,
  updateCategory,
}) => args => {
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
    });
  }

  setCatgories(args.treeData);
};

export const isBlank = string => !string || string.trim().length === 0;

export const CategoriesContainer = ({
  updateCategoryOrder,
  categories,
  catLoading,
  setCatgories,
  removeCategory,
  addNewCategory,
  addSubCategory,
  inputs,
  setInputs,
  slugEntered,
  setSlugEntered,
  subcategory,
  setSubcategory,
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
              onChange={treeData => setCatgories(treeData)}
              getNodeKey={categories.slug}
              onMoveNode={args => updateCategoryOrder(args)}
              generateNodeProps={rowInfo => ({
                buttons: [
                  <div>
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
            <h3>Add Category</h3>
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
              <div className="btn btn-primary" onClick={addNewCategory}>
                Add
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
                  onClick={() => addSubCategory(subcategory.rowInfo)}
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
  updateCategory: actions.updateCategory,
  addCategory: actions.addCategory,
};

export const CategoriesSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('categories', 'setCatgories', []),
  withState('inputs', 'setInputs', {}),
  withState('subcategory', 'setSubcategory', {}),
  withState('slugEntered', 'setSlugEntered', false),
  withHandlers({
    mapCatgories,
    removeCategory,
    addNewCategory,
    addSubCategory,
    updateCategoryOrder,
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
