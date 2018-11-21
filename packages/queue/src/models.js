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
