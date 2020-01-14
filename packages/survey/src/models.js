import { Utils } from 'common';
import * as constants from './constants';
import { List } from 'immutable';

export const Form = object => ({
  name: object.name,
  slug: object.slug,
  description: object.description,
  icon: Utils.getIcon(object, constants.DEFAULT_FORM_ICON),
  categories:
    object.categorizations && object.categorizations.map(c => c.category.slug),
  type: object.type,
  status: object.status,
  createdAt: object.createdAt,
  updatedAt: object.updatedAt,
  kapp: object.kapp,
});

export const Category = categoryHelper => category => {
  const forms = category.categorizations
    ? List(
        category.categorizations
          .map(categorization => Form(categorization.form))
          .filter(
            form =>
              constants.SUBMISSION_FORM_TYPES.includes(form.type) &&
              constants.SUBMISSION_FORM_STATUSES.includes(form.status),
          ),
      )
    : List();
  return {
    name: category.name,
    slug: category.slug,
    sortOrder: parseInt(
      Utils.getAttributeValue(category, constants.ATTRIBUTE_ORDER, 1000),
      10,
    ),
    icon: Utils.getIcon(category, constants.DEFAULT_CATEGORY_ICON),
    hidden:
      Utils.getAttributeValue(
        category,
        constants.ATTRIBUTE_HIDDEN,
        'false',
      ).toLowerCase() === 'true',
    parentSlug: Utils.getAttributeValue(category, constants.ATTRIBUTE_PARENT),
    forms,
    formCount: forms.size,
    hasParent() {
      return categoryHelper.hasCategory(this.parentSlug);
    },
    getParent() {
      return categoryHelper.getCategory(this.parentSlug);
    },
    hasChildren() {
      return categoryHelper.hasChildren(this.slug);
    },
    getChildren() {
      return categoryHelper.getChildren(this.slug);
    },
    getDescendants() {
      return categoryHelper.getDescendants(this.slug);
    },
    getTotalFormCount() {
      return this.getDescendants().reduce(
        (count, category) => count + category.formCount,
        this.formCount,
      );
    },
    isEmpty() {
      return (
        this.formCount === 0 &&
        !this.getDescendants().some(category => category.formCount > 0)
      );
    },
    getTrail() {
      return categoryHelper.getTrail(this);
    },
    getFullSortOrder() {
      return this.getTrail()
        .map(category => `${category.sortOrder}`.padStart(4, '0'))
        .join('.');
    },
  };
};

export const CategoryHelper = (categories = [], includeHidden = false) => {
  const helper = {
    getCategories() {
      return this.categories
        .toList()
        .sortBy(category => category.getFullSortOrder());
    },
    getRootCategories() {
      return this.categories
        .filter(category => !category.hasParent())
        .toList()
        .sortBy(category => category.getFullSortOrder());
    },
    hasCategory(slug) {
      return this.categories.has(slug);
    },
    getCategory(slug) {
      return this.categories.get(slug);
    },
    hasChildren(slug) {
      return this.categories.some(category => category.parentSlug === slug);
    },
    getChildren(slug) {
      return this.categories
        .filter(category => category.parentSlug === slug)
        .toList()
        .sortBy(category => category.getFullSortOrder());
    },
    getDescendants(slug) {
      return this.getChildren(slug)
        .flatMap(category => [category, ...this.getDescendants(category.slug)])
        .toList()
        .sortBy(category => category.getFullSortOrder());
    },
    getTrail(category, trail = List()) {
      return category
        ? this.getTrail(category.getParent(), trail.unshift(category))
        : trail;
    },
  };
  helper.categories = List(categories)
    .map(Category(helper))
    .filter(includeHidden ? category => category : category => !category.hidden)
    .toOrderedMap()
    .mapKeys((key, category) => category.slug);
  return helper;
};
