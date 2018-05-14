import React, { Fragment } from 'react';

export const NavigationsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Navigations</h1>
        <h2>Return Nav</h2>
        <div
          style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
        >
          <a className="nav-return" href="/#">
            <span className="icon">
              <span className="fa fa-fw fa-chevron-left" />
            </span>Teammates
          </a>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<a className="nav-return" href="/#">
  <span className="icon">
    <span className="fa fa-fw fa-chevron-left" />
  </span>Teammates
</a>`}</pre>
          </div>
        </div>
        <hr />
        <h2> Tabs</h2>
        <ul className="nav nav-tabs">
          <li role="presentation">
            <a className="active" aria-current="true" href="">
              Tab A
            </a>
          </li>
          <li role="presentation">
            <a aria-current="false" href="">
              Tab B
            </a>
          </li>
        </ul>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<ul className="nav nav-tabs">
  <li role="presentation">
    <a className="active" aria-current="true" href="">
      Tab A
    </a>
  </li>
  <li role="presentation">
    <a aria-current="false" href="">
      Tab B
    </a>
  </li>
</ul>`}
            </pre>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </Fragment>
);
