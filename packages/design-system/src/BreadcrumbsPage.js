import React, { Fragment } from 'react';

export const BreadcrumbsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Breadcrumbs</h1>
        <hr />
        <h2>Structure</h2>
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3> Example / </h3>
            <h1> Page Title</h1>
          </div>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="page-title">
  <div className="page-title__wrapper">
    <h3> Example  / </h3>
    <h1>  Page Title</h1>
  </div>
</div>`}</pre>
          </div>
        </div>
        <hr />
        <h2>Title with Button</h2>
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3> Example / </h3>
            <h1> Page Title</h1>
          </div>
          <button className="btn btn-primary">Action</button>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="page-title">
  <div className="page-title__wrapper">
    <h3> Example  / </h3>
    <h1>  Page Title</h1>
  </div>
  <button className="btn btn-primary">Action</button>
</div>`}</pre>
          </div>
        </div>
        <hr />
        <h2>Title with Buttons</h2>
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3> Example / </h3>
            <h1> Page Title</h1>
          </div>
          <div className="page-title__actions">
            <button className="btn btn-primary">Primary Action</button>
            <button className="btn btn-secondary">Secondary Action</button>
            <button className="btn btn-subtle">Subtle Action</button>
          </div>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="page-title">
  <div className="page-title__wrapper">
    <h3> Example  / </h3>
    <h1>  Page Title</h1>
  </div>
  <div className="page-title__actions">
    <button className="btn btn-primary">Action</button>
    <button className="btn btn-secondary">Action</button>
    <button className="btn btn-subtle">Action</button>
  </div>
</div>`}</pre>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </Fragment>
);
