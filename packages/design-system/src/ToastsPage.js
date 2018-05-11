import React, { Fragment } from 'react';

export const ToastsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Toasts</h1>
        <hr />
        <h2>Basic Toast</h2>

        <div className="toast toast--info">
          <div className="toast__message">
            <div className="toast__title">
              Toast Title Info
              <div className="toast__actions">
                <button className="btn btn-link">
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            </div>
            Info message goes here
          </div>
        </div>
        <div className="toast toast--warn">
          <div className="toast__message">
            <div className="toast__title">
              Toast Title Warning
              <div className="toast__actions">
                <button className="btn btn-link">
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            </div>
            Warning message goes here
          </div>
        </div>
        <div className="toast toast--success">
          <div className="toast__message">
            <div className="toast__title">
              Toast Title Success
              <div className="toast__actions">
                <button className="btn btn-link">
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            </div>
            Success message goes here
          </div>
        </div>
        <div className="toast toast--error">
          <div className="toast__message">
            <div className="toast__title">
              Toast Title Error
              <div className="toast__actions">
                <button className="btn btn-link">
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            </div>
            Error message goes here
          </div>
        </div>
        <div className="toast toast--normal">
          <div className="toast__message">
            <div className="toast__title">
              Toast Title Normal
              <div className="toast__actions">
                <button className="btn btn-link">
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            </div>
            Normal message goes here
          </div>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<!--- Toast Info --->
<div className="toast toast--info">
  <div className="toast__message">
    <div className="toast__title">
      Toast Title Info
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    Info message goes here
  </div>
</div>

  <!--- Toast Warning --->
<div className="toast toast--warn">
  <div className="toast__message">
    <div className="toast__title">
      Toast Title Warning
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    Warning message goes here
  </div>
</div>

<!--- Toast Success --->
<div className="toast toast--success">
  <div className="toast__message">
    <div className="toast__title">
      Toast Title Success
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    Success message goes here
  </div>
</div>

<!--- Toast Error --->
<div className="toast toast--error">
  <div className="toast__message">
    <div className="toast__title">
      Toast Title Error
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    Error message goes here
  </div>
</div>


<!--- Toast Normal --->
<div className="toast toast--normal">
  <div className="toast__message">
    <div className="toast__title">
      Toast Title Normal
      <div className="toast__actions">
        <button className="btn btn-link">
          <i className="fa fa-fw fa-times" />
        </button>
      </div>
    </div>
    Normal message goes here
  </div>
</div>`}</pre>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
