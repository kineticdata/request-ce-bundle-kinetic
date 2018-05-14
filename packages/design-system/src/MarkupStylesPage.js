import React, { Fragment } from 'react';

export const MarkupStylesPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Markup & Styles</h1>
        <hr />
        <h2>BEM Method</h2>
        <p>
          The BEM stands for Block, Element, Modifier which is basically an
          explanation for it’s structure. The BEM methodology is nothing but
          another naming convention for our CSS classes. However, BEM gained its
          popularity mainly because it provides clean system for marking up our
          layout.
        </p>
        <div className="flex-row">
          <h5>CSS</h5>
          <div className="highlight">
            <pre>
              {`/* Block * /
.block {}

/* Element * /
.block__element {}

/* Modifier * /
.block__element--modifier {}`}
            </pre>
          </div>
          <h5>HTML</h5>
          <div className="highlight">
            <pre>
              {`<div class="block">
  <div class="block__element" />
  <div class="block__element--modifier" />
</div>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
