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
        <div className="card card--request" style={{ width: '50%' }}>
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
