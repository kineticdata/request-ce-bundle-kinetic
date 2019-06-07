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
                <span className="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabIndex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabIndex="0"
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
                <span className="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabIndex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabIndex="0"
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
                <span className="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabIndex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabIndex="0"
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
                <span className="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabIndex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabIndex="0"
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
                <span className="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabIndex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabIndex="0"
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
                <span className="fa fa-ellipsis-h fa-2x" />
              </button>
              <div
                tabIndex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabIndex="0"
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
          <div
            className="card__header d-flex flex-row-reverse"
            style={{ width: '10rem' }}
          >
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
            <button className="btn btn-link text-sm-left pl-0">
              View place→
            </button>
          </div>
        </div>
        <hr />
        {/* -- Image Top -- */}
        <div className="card card--no-padding">
          <div className="card__header position-relative  m-0">
            <img
              src="https://tailwindcss.com/img/card-top.jpg"
              title="Mountain"
              alt=""
              className="text-center overflow-hidden"
              style={{ width: '100%' }}
            />
            <span
              className="tag tag--active tag--small position-absolute"
              style={{ top: '1rem', right: '1rem' }}
            >
              Tag
            </span>
          </div>
          <div className="card__body pt-4 px-4  pb-0">
            <span className="card__date">November 2018</span>
            <h1 className="card__title">Venice Islands</h1>
            <p className="card__text">
              Venice is a city in northeastern Italy and the capital of the
              Veneto region. It is situated across a group of 118 small islands
              that are separated by canals and linked by bridges, of which there
              are 400. The islands are located in the shallow Venetian Lagoon,
              an enclosed bay that lies between the mouths of the Po and the
              Piave rivers.
            </p>
          </div>

          <div className="card__footer px-4">
            <button className="btn btn-link text-sm-left pl-0">
              View place→
            </button>
          </div>
        </div>
        <hr />

        <hr />
        <h2>Blank Card</h2>
        {/* -- Blank Card -- */}
        <div className="card">
          <p>This is some text within a card</p>
        </div>
        <hr />
        <h2>Call to Action</h2>
        <div className="cards__wrapper">
          <div className="card card--cta card--blue" style={{ width: '24%' }}>
            <i className="fa fa-2x fa-photo" />
            Pictures
          </div>
          <div className="card card--cta card--green" style={{ width: '24%' }}>
            <i className="fa fa-2x fa-life-ring" />
            FAQ
          </div>
          <div
            className="card card--cta card--green text-center"
            style={{ width: '40%' }}
          >
            <h4>November 2019</h4>
            <h1>Euro Trip</h1>
            <span className="card--cta__rule" />
          </div>
        </div>
        {/* -- Profile Card -- */}
        <hr />
        <h2>Profile</h2>
        <div className="card card--profile">
          <div className="card__header">
            <img
              className="sb-avatar__image"
              width={96}
              height={96}
              src={'https://placekitten.com/192'}
              alt={'norm.orstad@kineticdata.com'}
              style={{
                maxWidth: '100%',
                width: '96px',
                height: '96px',
                borderRadius: '100%',
              }}
            />
          </div>
          <div className="card__body">
            <h2>Austin Gomez</h2>
            <p>
              <a href="mailto:">austin@gomez.org</a>
            </p>
            <p>555-555-1234</p>
            <a href="" className="btn btn-secondary">
              View Profile
            </a>
          </div>
        </div>
        {/* -- Team Card -- */}
        <hr />
        <h2>Teams</h2>
        <div className="card card--team">
          <div
            className="card__header card__header--team"
            style={{ backgroundColor: 'rgb(166, 48, 150)' }}
          >
            <span />
            <i className="fa fa-users card-icon" />
            <span />
          </div>
          <div className="card__body">
            <h1>Team Name</h1>
            <p>Description of team and what it is the team does</p>
          </div>
          <div className="card__footer">
            <h3>Members</h3>
            <div className="card-members__wrapper">
              <span>
                <div
                  className="sb-avatar sb-avatar--gravatar"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    width: '28px',
                    height: '28px',
                    borderRadius: '100%',
                  }}
                >
                  <img
                    className="sb-avatar__image"
                    width={28}
                    height={28}
                    src={'https://placekitten.com/150'}
                    alt={'Kitten Name'}
                    style={{
                      maxWidth: '100%',
                      width: '28px',
                      height: '28px',
                      borderRadius: '100%',
                    }}
                  />
                </div>
              </span>
            </div>
          </div>
        </div>
        {/* -- Import Card -- */}
        <hr />
        <h2>Import</h2>
        <div className="card card--import">
          <div className="card__body">
            <div aria-disabled="false" style={{ position: 'relative' }}>
              <i className="fa fa-2x fa-upload" />
              <h2>Upload a .csv file</h2>
              <p>
                Drag a file to attach or{' '}
                <span className="text-primary">browse</span>
              </p>
              <input
                type="file"
                multiple=""
                autoComplete="off"
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  bottom: '0px',
                  left: '0px',
                  opacity: '1e-05',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
        <hr />
        <h2>Meta Information</h2>
        <div className="card">
          <div className="card__body">
            <span className="card__meta">
              <dl>
                <span>
                  <dt className="">Confirmation</dt>
                  <dd className="">7CA127</dd>
                </span>
                <span>
                  <dt className="">Submitted</dt>
                  <dd className="">
                    <span className="time-ago">
                      <span className="time-ago__text">16 days ago</span>
                    </span>
                  </dd>
                </span>
                <span>
                  <dt className="">Est. Completion</dt>
                  <dd className="">
                    <span className="time-ago">
                      <span className="time-ago__text">9 days ago</span>
                    </span>
                  </dd>
                </span>
              </dl>
            </span>
          </div>
        </div>
        {/* -- Appointments -- */}
        <hr />
        <h2>Appointments</h2>
        <div className="card card--appt">
          <i
            className="fa fa-calendar fa-fw card-icon"
            style={{ background: 'rgb(255, 74, 94)' }}
          />
          <div className="flex-column flex-fill">
            <div className="card__body">
              <h1 className="card__title flex-row">
                <span>Thursday, January 31, 2019</span>
                <span className="submission-status submission-status--complete ml-auto">
                  Completed
                </span>
              </h1>
              <p className="card__subtitle">1:00 PM - 1:30 PM</p>
              <p className="card__text">Testing cancel button</p>
            </div>
            <div className="card__footer">
              <a className="btn btn-link text-left m-0 p-0" href="/">
                View Details →
              </a>
            </div>
          </div>
        </div>
        <hr />
        {/* -- Advanced Cards -- */}
        <h2>Advanced Card</h2>
        <div className="card">
          <h1 className="card__title mb-2">
            <span style={{ display: 'flex', alignContent: 'center' }}>
              <i className="fa fa-file-text-o fa-fw card-icon" />
              Card Title
            </span>
            <span className="status submission-status submission-status--open">
              Submitted
            </span>
            <div className="dropdown">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-sm btn btn-icon"
              >
                <span className="fa fa-ellipsis-v fa-2x" />
              </button>
              <div
                tabIndex="-1"
                role="menu"
                aria-hidden="true"
                className="dropdown-menu dropdown-menu-right"
              >
                <a
                  tabIndex="0"
                  className="dropdown-item"
                  href="#/kapps/services"
                >
                  Request to Cancel
                </a>
              </div>
            </div>
          </h1>
          <p className="card__text">Basic description</p>
          <span className="card__meta">
            <dl>
              <span>
                <dt className="">Confirmation</dt>
                <dd className="">7CA127</dd>
              </span>
              <span>
                <dt className="">Submitted</dt>
                <dd className="">16 days ago</dd>
              </span>
              <span>
                <dt className="">Est. Completion</dt>
                <dd className="">9 days ago</dd>
              </span>
            </dl>
          </span>
        </div>
      </div>
    </div>
  </Fragment>
);
