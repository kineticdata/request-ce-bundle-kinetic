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

        {/* -- Title with status ------ */}
        <div className="card" style={{ width: '90%' }}>
          <h1 className="card__title">
            Example Title
            <span className="submission-status submission-status--open">
              Open
            </span>
          </h1>
          <h2 className="card__title">
            Example Title{' '}
            <span className="submission-status submission-status--open">
              Open
            </span>
          </h2>
          <h3 className="card__title">
            Example Title
            <span className="submission-status submission-status--open">
              Open
            </span>
          </h3>
          <h4 className="card__title">
            Example Title
            <span className="submission-status submission-status--open">
              Open
            </span>
          </h4>
          <h5 className="card__title">
            Example Title
            <span className="submission-status submission-status--open">
              Open
            </span>
          </h5>
          <h6 className="card__title">
            Example Title
            <span className="submission-status submission-status--open">
              Open
            </span>
          </h6>
        </div>
        <hr />

        {/* -- Titles with all the bells and whistles -- */}
        <div className="card" style={{ width: '90%' }}>
          <h1 className="card__title">
            <i className="fa fa-file-text-o fa-fw card-icon" />
            Example Title
            <small>Small Meta</small>
            <span className="tag tag--active">Tag Default</span>
            <span className="tag tag--active tag--small">Tag Small</span>
            <span className="submission-status submission-status--open">
              Open
            </span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span class="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabindex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabindex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h1>
          <h2 className="card__title">
            <i className="fa fa-file-text-o fa-fw card-icon" />
            Example Title
            <small>Small Meta</small>
            <span className="tag tag--active">Tag Default</span>
            <span className="tag tag--active tag--small">Tag Small</span>
            <span className="submission-status submission-status--open">
              Open
            </span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span class="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabindex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabindex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h2>
          <h3 className="card__title">
            <i className="fa fa-file-text-o fa-fw card-icon" />
            Example Title
            <small>Small Meta</small>
            <span className="tag tag--active">Tag Default</span>
            <span className="tag tag--active tag--small">Tag Small</span>
            <span className="submission-status submission-status--open">
              Open
            </span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span class="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabindex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabindex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h3>
          <h4 className="card__title">
            <i className="fa fa-file-text-o fa-fw card-icon" />
            Example Title
            <small>Small Meta</small>
            <span className="tag tag--active">Tag Default</span>
            <span className="tag tag--active tag--small">Tag Small</span>
            <span className="submission-status submission-status--open">
              Open
            </span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span class="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabindex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabindex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h4>
          <h5 className="card__title">
            <i className="fa fa-file-text-o fa-fw card-icon" />
            Example Title
            <small>Small Meta</small>
            <span className="tag tag--active">Tag Default</span>
            <span className="tag tag--active tag--small">Tag Small</span>
            <span className="submission-status submission-status--open">
              Open
            </span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span class="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabindex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabindex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h5>
          <h6 className="card__title">
            <i className="fa fa-file-text-o fa-fw card-icon" />
            Example Title
            <small>Small Meta</small>
            <span className="tag tag--active">Tag Default</span>
            <span className="tag tag--active tag--small">Tag Small</span>
            <span className="submission-status submission-status--open">
              Open
            </span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span class="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabindex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabindex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h6>
        </div>
        <hr />
        {/* -- Card 14 -- */}
        <h2>Card Example</h2>
        <div className="card p-4">
          <div className="card__header d-flex flex-row-reverse">
            <span className="tag tag--active tag--small">Tag Small</span>
          </div>
          <span className="card__date">November 2018</span>
          <h1 className="card__title">Venice Islands</h1>
          <p>
            Venice is a city in northeastern Italy and the capital of the Veneto
            region. It is situated across a group of 118 small islands that are
            separated by canals and linked by bridges, of which there are 400.
            The islands are located in the shallow Venetian Lagoon, an enclosed
            bay that lies between the mouths of the Po and the Piave rivers.
          </p>
          <div className="card__footer">
            <button className="btn btn-link text-sm-left">View place→</button>
          </div>
        </div>
        <hr />
        {/* -- Blank Card -- */}
        <div className="card">
          <p>This is some text within a card</p>
        </div>
        <hr />
        <div className="card">
          <p>This is some text within a card</p>
          <p>A second row of text within a card</p>
          <span className="meta">
            <dl className="row">
              <div className="col">
                <dt>Test</dt>
                <dd>Meta</dd>
              </div>
            </dl>
          </span>
        </div>
        <hr />
        <h2>Example Advanced Card</h2>
        <div className="card card--request" style={{ width: '50%' }}>
          <h1 className="card__title">
            <i className="fa fa-file-text-o fa-fw card-icon" />
            <span>Card Title</span>
            <span className="status status--green">Submitted</span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span class="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabindex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabindex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h1>
          <p>Basic description</p>
          <span className="meta">
            <dl className="row">
              <div className="col">
                <dt className="">Confirmation</dt>
                <dd class="">7CA127</dd>
              </div>
              <div className="col">
                <dt className="">Submitted</dt>
                <dd className="">
                  <span class="time-ago">
                    <span
                      className="time-ago__text"
                      id="tooltip-4fa3c14f-7ac9-42a0-9703-086eb961a37d"
                    >
                      16 days ago
                    </span>
                  </span>
                </dd>
              </div>
              <div className="col">
                <dt class="">Est. Completion</dt>
                <dd className="">
                  <span className="time-ago">
                    <span
                      className="time-ago__text"
                      id="tooltip-e13fa43d-c9dc-4627-bc1a-d8ef87fdbd23"
                    >
                      9 days ago
                    </span>
                  </span>
                </dd>
              </div>
            </dl>
          </span>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="card card--request">
    <h1>
      <i className="fa fa-file-text-o fa-fw card-icon" />
      <span>Card Title</span>
      <span className="status status--green">Submitted</span>
      <div className="dropdown">
        <button type="button" aria-haspopup="true" aria-expanded="false" className="btn-sm btn btn-icon">
          <span class="fa fa-ellipsis-h fa-2x"></span>
        </button>
        <div tabindex="-1" role="menu" aria-hidden="true" className="dropdown-menu dropdown-menu-right">
          <a tabindex="0" className="dropdown-item" href="#/kapps/services">Request to Cancel</a>
        </div>
      </div>
    </h1>
    <p>Basic description</p>
    <span className="meta">
      <dl className="row">
        <div className="col">
          <dt className="">Confirmation</dt>
          <dd class="">7CA127</dd>
        </div>
        <div className="col">
          <dt className="">Submitted</dt>
          <dd className="">
            <span class="time-ago">
              <span className="time-ago__text" id="tooltip-4fa3c14f-7ac9-42a0-9703-086eb961a37d">16 days ago</span>
            </span>
          </dd>
        </div>
        <div className="col">
          <dt class="">Est. Completion</dt>
          <dd className="">
            <span className="time-ago">
              <span className="time-ago__text" id="tooltip-e13fa43d-c9dc-4627-bc1a-d8ef87fdbd23">9 days ago</span>
            </span>
          </dd>
        </div>
      </dl>
    </span>
  </div>
`}</pre>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
