import React, { Fragment } from 'react';

export const CardsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Cards</h1>
        <hr />
        <h2>Basic Card</h2>
        <div className="card card--design-system" style={{ width: '33%' }}>
          <h1>Basic Card Title</h1>
          <p>Basic description</p>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="card card--design-system">
  <h1>Basic Card</h1>
  <p>Basic description</p>
</div>`}</pre>
          </div>
        </div>
        <hr />
        <h2>Advanced Card</h2>
        <div className="card card--request" style={{ width: '33%' }}>
          <h1>Basic Card Title</h1>
          <p>Basic description</p>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="card card--design-system">
  <h1>Basic Card</h1>
  <p>Basic description</p>
</div>`}</pre>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
