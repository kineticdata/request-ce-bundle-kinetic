import React, { Fragment } from 'react';

export const ToastsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-12">
        <h1>Toasts</h1>
        <hr />
        <h2>Basic Toast</h2>

        <div className="toast toast--normal toast--large">
          <div className="toast__wrapper">
            <div className="toast__title">
              Toast Title Info
              <div className="toast__actions">
                <button className="btn btn-link">
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            </div>
            <div className="toast__message">Info message goes here</div>
          </div>
        </div>
      </div>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<!--- Toast Normal --->
<div className="toast toast--normal toast--large">
  <div className="toast__wrapper">
    <div className="toast__title">
      Toast Title Normal
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    <div className="toast__message">Info message goes here</div>
  </div>
</div>`}</pre>
        </div>
      </div>
      <hr />
      <h3>Size Variables</h3>

      <div className="toast toast--normal toast--small">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Small
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
          <div className="toast__message">Sample message goes here</div>
        </div>
      </div>
      <div className="toast">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Regular
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
          <div className="toast__message">Sample message goes here</div>
        </div>
      </div>
      <div className="toast toast--normal toast--large">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Large
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
          <div className="toast__message">Sample message goes here</div>
        </div>
      </div>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<!--- Toast Size Small --->
<div className="toast toast--normal toast--small">
  <div className="toast__wrapper">
    <div className="toast__title">
      Toast Title--Small
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    <div className="toast__message">Sample message goes here</div>
  </div>
</div>

<!--- Toast Size Regular --->
<div className="toast toast--normal">
  <div className="toast__wrapper">
    <div className="toast__title">
      Toast Title--Regular
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    <div className="toast__message">Sample message goes here</div>
  </div>
</div>

<!--- Toast Size Large --->
<div className="toast toast--normal toast--large">
  <div className="toast__wrapper">
    <div className="toast__title">
      Toast Title--Large
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    <div className="toast__message">Sample message goes here</div>
  </div>
</div>`}</pre>
        </div>
      </div>
      <hr />
      <h3>Message Variables</h3>
      <div className="toast toast--normal">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Large--No Message
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="toast toast--normal toast--large">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Large--Not dismissible
          </div>
        </div>
      </div>

      <hr />
      <h3>Other Variables</h3>
      <div className="toast toast--normal toast--small toast--rounded">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Small--rounded
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
          <div className="toast__message">Sample message goes here</div>
        </div>
      </div>
      <div className="toast toast--warn toast--large ">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Warning
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
          <div className="toast__message">Warning message goes here</div>
        </div>
      </div>
      <div className="toast toast--large toast--success">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Success
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
          <div className="toast__message">Success message goes here</div>
        </div>
      </div>
      <div className="toast toast--large toast--error">
        <div className="toast__wrapper">
          <div className="toast__title">
            Toast Title--Error
            <div className="toast__actions">
              <button className="btn btn-link">
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          </div>
          <div className="toast__message">Error message goes here</div>
        </div>
      </div>

      <div className="flex-row">
        <div className="highlight">
          <pre>{`
  <!--- Toast Warning --->
<div className="toast toast--warn toast--large">
  <div className="toast__wrapper">
    <div className="toast__title">
      Toast Title Warning
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    <div className="toast__message">Warning message goes here</div>
  </div>
</div>

<!--- Toast Success --->
<div className="toast toast--success toast--large">
  <div className="toast__wrapper">
    <div className="toast__title">
      Toast Title Success
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    <div className="toast__message">Success message goes here</div>
  </div>
</div>

<!--- Toast Error --->
<div className="toast toast--error toast-large">
  <div className="toast__wrapper">
    <div className="toast__title">
      Toast Title Error
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    <div className="toast__message">Error message goes here</div>
  </div>
</div>`}</pre>
        </div>
      </div>
    </div>
  </Fragment>
);
