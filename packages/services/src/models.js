import { Utils } from 'common';
import * as constants from './constants';

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

export const Category = object => ({
  name: object.name,
  slug: object.slug,
  sortOrder: parseInt(
    Utils.getAttributeValue(object, constants.ATTRIBUTE_ORDER, 1000),
    10,
  ),
  icon: Utils.getIcon(object, constants.DEFAULT_CATEGORY_ICON),
  hidden:
    Utils.getAttributeValue(
      object,
      constants.ATTRIBUTE_HIDDEN,
      'false',
    ).toLowerCase() === 'true',
  parent: Utils.getAttributeValue(object, constants.ATTRIBUTE_PARENT),
  forms: object.categorizations
    ? object.categorizations
        .map(c => Form(c.form))
        .filter(
          form =>
            form.type === constants.SUBMISSION_FORM_TYPE &&
            form.status === constants.SUBMISSION_FORM_STATUS,
        )
    : null,
});
