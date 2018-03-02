import React from 'react';
import { KappLink as Link } from 'common';

const ServiceCardTop = ({ form }) => (
  <div className="service-icon-wrapper">
    <div className="icn-frame">
      <i className={`fa fa-fw ${form.icon}`} />
    </div>
  </div>
);

const ServiceCardBottom = ({ form, categorySlug }) => (
  <div className="service-details-wrapper">
    <h5 className="ellipsis">
      <Link
        to={
          categorySlug
            ? `/categories/${categorySlug}/${form.slug}`
            : `/forms/${form.slug}`
        }
      >
        {form.name}
      </Link>
    </h5>
    <p className="ellipsis">{form.description}</p>
  </div>
);

export const ServiceCardLarge = ({ form, categorySlug }) => (
  <div className="card-wrapper col-xs-12">
    <div className="service-card clearfix">
      <ServiceCardTop form={form} />
      <ServiceCardBottom form={form} categorySlug={categorySlug} />
    </div>
  </div>
);

export const ServiceCardSmall = ({ form, categorySlug }) => (
  <div className="clearfix submission">
    <ServiceCardTop form={form} />
    <ServiceCardBottom form={form} categorySlug={categorySlug} />
  </div>
);
