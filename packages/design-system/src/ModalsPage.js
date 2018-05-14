import React, { Fragment } from 'react';

export const ModalsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Modals</h1>
        <hr />
        <h2>Basic</h2>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-content">
              <div className="modal-header">
                <h4 class="modal-title">
                  <button type="button" class="btn btn-link">
                    Button
                  </button>
                  <span>Modal Title</span>
                  <button type="button" class="btn btn-link">
                    Button
                  </button>
                </h4>
              </div>
              <div className="modal-body">
                <div className="embedded-core-form">
                  <form>
                    <div className="form-group">
                      <label htmlFor="">Email</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Password</label>
                      <input type="text" className="form-control" />
                    </div>
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <div className="btn btn-primary">Button</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<div className="modal-dialog">
  <div className="modal-content">
    <div className="modal-content">
      <div className="modal-header">
        <h4 class="modal-title">
          <button type="button" class="btn btn-link">
            Button
          </button>
          <span>Modal Title</span>
          <button type="button" class="btn btn-link">
            Button
          </button>
        </h4>
      </div>
      <div className="modal-body">
        <div className="embedded-core-form">
          <form>
            <div className="form-group">
              <label htmlFor="">Email</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="">Password</label>
              <input type="text" className="form-control" />
            </div>
          </form>
        </div>
      </div>
      <div className="modal-footer">
        <div className="btn btn-primary">Button</div>
      </div>
    </div>
  </div>
</div>`}</pre>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </Fragment>
);
