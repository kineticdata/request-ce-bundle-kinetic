import React, { Fragment } from 'react';

export const PaginationPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Paginations</h1>
        <h2>Simple with icons</h2>
        <div
          style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
        >
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item disabled">
                <a class="page-link" href="#" aria-label="Previous">
                  <span className="icon">
                    <span
                      className="fa fa-fw fa-caret-left"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="sr-only">Previous</span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">
                  1
                </a>
              </li>
              <li class="page-item active">
                <a class="page-link" href="#">
                  2
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">
                  3
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                  <span className="icon">
                    <span
                      className="fa fa-fw fa-caret-right"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="sr-only">Next</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#" aria-label="Previous">
        <span class="icon">
          <span class="fa fa-fw fa-caret-left" aria-hidden="true" />
        </span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span class="icon">
          <span class="fa fa-fw fa-caret-right" aria-hidden="true" />
        </span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>`}</pre>
          </div>{' '}
        </div>
        <hr />
        <h2>Simple with Text</h2>
        <div
          style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
        >
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item disabled">
                <a class="page-link" href="#" aria-label="Previous">
                  <span>Previous</span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">
                  1
                </a>
              </li>
              <li class="page-item active">
                <a class="page-link" href="#">
                  2
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">
                  3
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                  <span>Next</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#" aria-label="Previous">
        <span>Previous</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span>Next</span>
      </a>
    </li>
  </ul>
</nav>`}</pre>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
