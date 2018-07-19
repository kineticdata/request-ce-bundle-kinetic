import { Utils } from 'common';
import * as constants from './constants';

export const Form = object => ({
  name: object.name,
  slug: object.slug,
  description: object.description,
  icon: Utils.getAttributeValue(
    object,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_FORM_ICON,
  ),
  categories:
    object.categorizations && object.categorizations.map(c => c.category.slug),
  type: object.type,
  status: object.status,
  createdAt: object.createdAt,
  updatedAt: object.updatedAt,
});

export const Category = object => ({
  name: object.name,
  slug: object.slug,
  sortOrder: parseInt(
    Utils.getAttributeValue(object, constants.ATTRIBUTE_ORDER, 1000),
    10,
  ),
  icon: Utils.getAttributeValue(
    object,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_CATEGORY_ICON,
  ),
  hidden:
    Utils.getAttributeValue(
      object,
      constants.ATTRIBUTE_HIDDEN,
      'false',
    ).toLowerCase() === 'true',
  parent: Utils.getAttributeValue(object, constants.ATTRIBUTE_PARENT),
  forms: object.categorizations && object.categorizations.map(c => c.form.slug),
});
