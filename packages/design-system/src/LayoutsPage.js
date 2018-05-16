import React, { Fragment } from 'react';

export const LayoutsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Layouts</h1>
        <hr />
        <h2>Page Structure</h2>
        <h3>Single Panel</h3>
        <div className="ki-example">
          <div className="ki-example-container">
            <div className="ki-example-container--header" />
            <div className="ki-example-container--row">
              <div className="ki-example-container--sidebar" />
              <div className="ki-example-container--body" />
            </div>
          </div>
        </div>
        {/* Highlights  */}
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="page-container">
  <div className="page-panel">
    <!-- Content here -->
  </div>
</div>`}</pre>
          </div>
        </div>
        {/* End Hightlights */}
        <hr />

        <h2>Page Panels</h2>
        <h3>Two Thirds/ One Thirds</h3>
        <div className="ki-example">
          <div className="ki-example-container">
            <div className="ki-example-container--header" />
            <div className="ki-example-container--row">
              <div className="ki-example-container--sidebar" />
              <div className="ki-example-container--row ki-example-container--page-panels">
                <div className="ki-example-container--two-thirds ki-example-container--centering" />
                <div className="ki-example-container--one-thirds ki-example-container--centering ki-example-container--centering" />
              </div>
            </div>
          </div>
        </div>

        {/* Highlights  */}
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="page-container page-container--panels">
  <div className="page-panel page-panel--two-thirds">
    <!-- Content here -->
  </div>
  <div className="page-panel page-panel--one-thirds">
    <!-- Content here -->
  </div>
</div>`}</pre>
          </div>
        </div>
        {/* End Hightlights */}

        <h3>Three Fifths/ Two Fifths</h3>
        <div className="ki-example">
          <div className="ki-example-container">
            <div className="ki-example-container--header" />
            <div className="ki-example-container--row">
              <div className="ki-example-container--sidebar" />
              <div className="ki-example-container--row ki-example-container--page-panels">
                <div className="ki-example-container--three-fifths" />
                <div className="ki-example-container--two-fifths" />
              </div>
            </div>
          </div>
        </div>

        {/* Highlights  */}
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="page-container page-container--panels">
  <div className="page-panel page-panel--three-fifths">
    <!-- Content here -->
  </div>
  <div className="page-panel page-panel--two-fifths">
    <!-- Content here -->
  </div>
</div>`}</pre>
          </div>
        </div>
        {/* End Hightlights */}
        <hr />
      </div>
    </div>
  </Fragment>
);
