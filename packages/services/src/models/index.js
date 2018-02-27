import { getAttributeValue } from '../helpers';
import * as constants from '../constants';

export const Form = object => ({
  name: object.name,
  slug: object.slug,
  description: object.description,
  icon: getAttributeValue(
    object,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_FORM_ICON,
  ),
  categories:
    object.categorizations && object.categorizations.map(c => c.category.slug),
  type: object.type,
  status: object.status,
});

export const Category = object => ({
  name: object.name,
  slug: object.slug,
  sortOrder: parseInt(
    getAttributeValue(object, constants.ATTRIBUTE_ORDER, 1000),
    10,
  ),
  icon: getAttributeValue(
    object,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_CATEGORY_ICON,
  ),
  hidden:
    getAttributeValue(
      object,
      constants.ATTRIBUTE_HIDDEN,
      'false',
    ).toLowerCase() === 'true',
  parent: getAttributeValue(object, constants.ATTRIBUTE_PARENT),
  forms: object.categorizations && object.categorizations.map(c => c.form.slug),
});
