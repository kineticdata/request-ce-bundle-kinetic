import React, { Fragment } from 'react';

export const PopoversPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Popovers</h1>
        <hr />
        <h2>Delete Popover</h2>

        <div
          className="popover__wrapper popover__wrapper--delete"
          style={{ position: 'relative' }}
        >
          <div className="btn-group btn-group-sm">
            <button id="alert-confirm-#" className="btn btn-danger">
              <span className="fa fa-fw fa-close" />
            </button>
            <a className="btn btn-primary" href="#">
              <span className="fa fa-fw fa-pencil" />
            </a>
          </div>
          <div
            className="popover show bs-popover-right"
            data-placement="left"
            style={{ top: '-35px', left: '20px' }}
          >
            <div className="popover-inner">
              <div className="popover-body">
                <p>Remove Alert?</p>
                <button type="button" className="btn btn-danger">
                  Yes
                </button>
                <button type="button" className="btn btn-link">
                  No
                </button>
              </div>
            </div>
            <span className="arrow" style={{ top: '35px' }} />
          </div>
          <div className="flex-row">
            <div className="highlight">
              <pre>Code goes here</pre>
            </div>
          </div>
        </div>

        <hr />

        <h2>Ellipsis Popover</h2>
        <div
          className="popover__wrapper--ellipsis"
          style={{ position: 'relative' }}
        >
          <button className="btn btn-icon">
            <span className="fa fa-ellipsis-h" />
          </button>
          <div
            tabindex="-1"
            role="menu"
            aria-hidden="false"
            className="dropdown-menu dropdown-menu-left show"
            data-placement="bottom-end"
            style={{
              position: 'absolute',
              willChange: 'transform',
              top: '0px',
              left: '0px',
              transform: 'translate3d(0, 0px, 0px)',
            }}
          >
            <a
              tabindex="0"
              className="dropdown-item"
              href="#/settings/datastore/people/new"
            >
              Create Submission
            </a>
            <a
              tabindex="0"
              className="dropdown-item"
              href="#/settings/datastore/people/settings"
            >
              Configure Form
            </a>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
