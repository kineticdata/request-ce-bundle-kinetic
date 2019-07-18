import React, { Fragment } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

export const TablesPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-12">
        <h1>Tables</h1>
        <hr />
        <h2>Best practices</h2>
        <p>Data tables should:</p>
        <ul>
          <li>Show values across multiple categories and measures.</li>
          <li>
            Allow for filtering and ordering when comparison is not a priority.
          </li>
          <li>
            Help users visualize and scan many values from an entire data set.
          </li>
          <li>
            Help users find other values in the data hierarchy through use of
            links.
          </li>
          <li>
            Minimize clutter by only including values that supports the data’s
            purpose.
          </li>
          <li>Include a summary row to surface the column totals.</li>
          <li>Not include calculations within the summary row.</li>
          <li>
            Wrap instead of truncate content. This is because if row titles
            start with the same word, they’ll all appear the same when
            truncated.
          </li>
          <li>
            Not to be used for an actionable list of items that link to details
            pages.
          </li>
        </ul>
        <h3>Alignment</h3>
        <p>The following alignment rules are followed:</p>
        <ul>
          <li>Numerical = Right aligned</li>
          <li>Textual data = Left aligned</li>
          <li>Align headers with their related data</li>
          <li>Don’t center align</li>
        </ul>

        <h3>Headers</h3>
        <p>Headers should:</p>
        <ul>
          <li>Be informative and descriptive</li>
          <li>Concise and scannable</li>
          <li>
            Include units of measurement symbols so they aren’t repeated
            throughout the columns
          </li>
          <li>Use sentence case (first word capitalized, rest lowercase)</li>
          <li>Do: 'Temperature °C'; Don't: 'Temperature'</li>
        </ul>

        <p>Column content should:</p>
        <ul>
          <li>Be concise and scannable</li>
          <li>
            Not include units of measurement symbols (put those symbols in the
            headers)
          </li>
          <li>Use sentence case (first word capitalized, rest lowercase)</li>
        </ul>
        <h3>Decimals</h3>
        <p>
          Keep decimals consistent. For example, don’t use 3 decimals in one row
          and 2 in others.
        </p>
        <hr />
        <h2>Basic Table</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Header</th>
              <th scope="col">Col 1</th>
              <th scope="col">Col 2</th>
              <th scope="col">Col 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Body</th>
              <td>Row 1, Col 1</td>
              <td>Row 1, Col 2</td>
              <td>Row 1, Col 3</td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Row 2, Col 1</td>
              <td>Row 2, Col 2</td>
              <td>Row 2, Col 3</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Footer</th>
              <td colSpan="3">&nbsp;</td>
            </tr>
          </tfoot>
        </table>

        <hr />
        <h2>
          Example Table <small>with sorting</small>
        </h2>

        <table className="table table-hover">
          <thead className="sortable">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th width="10%" className="sort-disabled">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Body Title 1</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                Body Title 2{' '}
                <span className="badge badge-pill badge-primary">Active</span>
              </td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 3</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr className="table-active">
              <td>Body Title 4</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 5</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 6</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 7</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Footer</td>
            </tr>
          </tfoot>
        </table>

        <nav aria-label="Page navigation">
          <ul className="pagination d-flex justify-content-end">
            <li className="page-item disabled">
              <a className="page-link" href="#" aria-label="Previous">
                <span className="icon">
                  <span className="fa fa-fw fa-caret-left" aria-hidden="true" />
                </span>
                <span className="sr-only">Previous</span>
              </a>
            </li>
            <li className="page-item">
              <a class="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item active">
              <a class="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a class="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span className="icon">
                  <span
                    className="fa fa-fw fa-caret-right"
                    aria-hidden="true"
                  />
                </span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>

        <hr />
        <h2>
          Example Table <small>with filtering</small>
        </h2>
        <div className="d-flex justify-content-end pb-1">
          <button className="btn btn-inverse  mr-1">
            <i className="fa fa-fw fa-filter" /> Filter
          </button>{' '}
          <Dropdown>
            <DropdownToggle color="link" className="btn btn-inverse">
              <span className="fa fa-filter fa-fw" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem to={` `}>New</DropdownItem>
              <DropdownItem to={` `}>Edit</DropdownItem>
              <DropdownItem to={` `}>Clone</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <table className="table table-hover">
          <thead className="sortable">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th width="10%" className="sort-disabled">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Body Title 1</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                Body Title 2{' '}
                <span className="badge badge-pill badge-primary">Active</span>
              </td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr className="table-active">
              <td>Body Title 3</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 4</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 5</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Footer</td>
            </tr>
          </tfoot>
        </table>

        <hr />
        <h2>
          Example Table <small>with search</small>
        </h2>
        <div className="d-flex justify-content-end pb-1">
          <div className="search-box col-3">
            <form className="search-box__form search-box__form--sm">
              <input type="text" placeholder="Search..." value="" />
              <button type="submit">
                <span className="fa fa-search" />
              </button>
            </form>
          </div>
        </div>
        <table className="table table-hover">
          <thead className="sortable">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th width="10%" className="sort-disabled">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Body Title 1</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                Body Title 2{' '}
                <span className="badge badge-pill badge-primary">Active</span>
              </td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 3</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr className="table-active">
              <td>Body Title 4</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Body Title 5</td>
              <td>Description goes here</td>
              <td>
                <div className="btn-group">
                  <div className="btn btn-primary btn-sm" title="Edit">
                    <i className="fa fa-pencil" />
                  </div>
                  <div className="btn btn-danger btn-sm" title="Delete">
                    <i className="fa fa-times" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" />
            </tr>
          </tfoot>
        </table>

        <hr />

        <h2>Striped Rows </h2>
        <p>
          There are multiple studys that yielded no evidence that zebra striping
          consistently improves the accuracy or speed of tasks. Use striped rows
          when you know it doesn't make things aesthetically worse.
        </p>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Header</th>
              <th scope="col"> Col 1</th>
              <th scope="col"> Col 2</th>
              <th scope="col" width="10%">
                {' '}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Body</th>
              <td> Row 1, Col 1</td>
              <td> Row 1, Col 2</td>{' '}
              <td>
                <Dropdown>
                  <DropdownToggle color="link" className="btn-sm">
                    <span className="fa fa-ellipsis-h fa-2x" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem to={` `}>New</DropdownItem>
                    <DropdownItem to={` `}>Edit</DropdownItem>
                    <DropdownItem to={` `}>Clone</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Row 2, Col 1</td>
              <td>Row 2,Col 2</td>{' '}
              <td>
                <Dropdown>
                  <DropdownToggle color="link" className="btn-sm">
                    <span className="fa fa-ellipsis-h fa-2x" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem to={` `}>New</DropdownItem>
                    <DropdownItem to={` `}>Edit</DropdownItem>
                    <DropdownItem to={` `}>Clone</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Row 3, Col 1</td>
              <td>Row 3, Col 2</td>
              <td>
                <Dropdown>
                  <DropdownToggle color="link" className="btn-sm">
                    <span className="fa fa-ellipsis-h fa-2x" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem to={` `}>New</DropdownItem>
                    <DropdownItem to={` `}>Edit</DropdownItem>
                    <DropdownItem to={` `}>Clone</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Row 4, Col 1</td>
              <td>Row 4,Col 2</td>{' '}
              <td>
                <Dropdown>
                  <DropdownToggle color="link" className="btn-sm">
                    <span className="fa fa-ellipsis-h fa-2x" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem to={` `}>New</DropdownItem>
                    <DropdownItem to={` `}>Edit</DropdownItem>
                    <DropdownItem to={` `}>Clone</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">Footer</td>
            </tr>
          </tfoot>
        </table>
        <p>
          When the amount of actions or triggers is larger than two, place them
          into an "ellipsis" dropdown to save on space and reduct cognative
          overload.
        </p>
        <hr />

        <h2>Captions</h2>

        <p>
          A <code className="hightligher-rouge">{`<caption>`}</code> functions
          like a heading for a table. It helps users with screen readers to find
          a table and understand what it’s about and decide if they want to read
          it.
        </p>
        <table className="table table-hover">
          {/* For Screen Readers */}
          <caption>Captioned Table</caption>
          <thead>
            <tr>
              <th>Header</th>
              <th scope="col">Col 1</th>
              <th scope="col">Col 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Body</th>
              <td>Row 1, Col 1</td>
              <td>Row 1, Col 2</td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Row 2, Col 1</td>
              <td>Row 2,Col 2</td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Row 3, Col 1</td>
              <td>Row 3, Col 2</td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Row 4, Col 1</td>
              <td>Row 4,Col 2</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Footer</td>
            </tr>
          </tfoot>
        </table>
        <hr />
        <h2>Responsive Table </h2>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Header</th>
                <th scope="col">Col 1</th>
                <th scope="col">Col 2</th>
                <th scope="col">Col 3</th>
                <th scope="col">Col 4</th>
                <th scope="col">Col 5</th>
                <th scope="col">Col 6</th>
                <th scope="col">Col 7</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Body</th>
                <td>Row 1, Col 1</td>
                <td>Row 1, Col 2</td>
                <td>Row 1, Col 3</td>
                <td>Row 1, Col 4</td>
                <td>Row 1, Col 5</td>
                <td>Row 1, Col 6</td>
                <td>Row 1, Col 7</td>
              </tr>
              <tr>
                <th scope="row">Body</th>
                <td>Row 2, Col 1</td>
                <td>Row 2,Col 2</td>
                <td>Row 2,Col 3</td>
                <td>Row 2,Col 4</td>
                <td>Row 2,Col 5</td>
                <td>Row 2,Col 6</td>
                <td>Row 2,Col 7</td>
              </tr>
              <tr>
                <th scope="row">Body</th>
                <td>Row 3, Col 1</td>
                <td>Row 3, Col 2</td>
                <td>Row 3, Col 3</td>
                <td>Row 3, Col 4</td>
                <td>Row 3, Col 5</td>
                <td>Row 3, Col 6</td>
                <td>Row 3, Col 7</td>
              </tr>
              <tr>
                <th scope="row">Body</th>
                <td>Row 4, Col 1</td>
                <td>Row 4,Col 2</td>
                <td>Row 4,Col 3</td>
                <td>Row 4,Col 4</td>
                <td>Row 4,Col 5</td>
                <td>Row 4,Col 6</td>
                <td>Row 4,Col 7</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8" className="text-center">
                  Footer
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <hr />
        <h2>Condensed Table </h2>
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Header Col 1</th>
              <th scope="col">Header Col 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Body Row 1, Col 1</td>
              <td>Body Row 1, Col 2</td>
            </tr>
            <tr>
              <td>Body Row 2, Col 1</td>
              <td>Body Row 2,Col 2</td>
            </tr>
            <tr>
              <td>Body Row 3, Col 1</td>
              <td>Body Row 3, Col 2</td>
            </tr>
            <tr>
              <td>Body Row 4, Col 1</td>
              <td>Body Row 4,Col 2</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="text-center">
                Footer Centered
              </td>
            </tr>
          </tfoot>
        </table>
        <hr />
        <h2>Numbered Tables</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th className="text-right">Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>January</td>
              <td className="text-right">$100</td>
            </tr>
            <tr>
              <td>February</td>
              <td className="text-right">$80</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="font-weight-bold">Sum</td>
              <td className="text-right text-danger font-weight-bold">$180</td>
            </tr>
          </tfoot>
        </table>
        <hr />
        <h2>Empty State Tables</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Summary</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2" className="text-center">
                <em>
                  No summaries found. This is an example empty state. Your
                  language should be relevant to the user.
                </em>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="text-center" colSpan="2" />
            </tr>
          </tfoot>
        </table>
        <hr />
        <h2>Inline-Editing Table</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Summary</th>
              <th width="10%">Status</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="">
                <em>Body Row 1, Col 1</em>
              </td>
              <td>
                {' '}
                <span className="submission-status submission-status--pending">
                  Pending
                </span>
              </td>
              <td className="text-right">
                <div className="btn-group btn-group-sm">
                  <a className="btn btn-primary" href="" title="Edit">
                    <span className="fa fa-fw fa-pencil" />
                  </a>
                  <button className="btn btn-danger" title="Delete">
                    <span className="fa fa-fw fa-close" />
                  </button>
                </div>
              </td>
            </tr>
            <tr className="is-editing">
              <td className="">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value="Body Row 1, Col 1"
                />
              </td>
              <td>
                <select name="" id="" className="form-control form-control-sm">
                  <option value="pending">Pending</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
              <td className="text-right">
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-danger" title="Close">
                    <span className="fa fa-fw fa-close" />
                  </button>
                  <a className="btn btn-success" href="" title="Save">
                    <span className="fa fa-fw fa-check" />
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="" colSpan="3" />
            </tr>
          </tfoot>
        </table>
        <hr />
        <h2>Addition Table</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Summary</th>
              <th width="10%">Status</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="">
                <em>Body Row 1, Col 1</em>
              </td>
              <td>
                <span className="submission-status submission-status--open">
                  Open
                </span>
              </td>
              <td className="text-right">
                <button className="btn btn-sm btn-danger" title="Remove">
                  <span className="fa fa-fw fa-close" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="tr--edit">
              <td>
                <input type="text" className="form-control form-control-sm" />
              </td>
              <td className="" width="20%">
                <select
                  name="addition-select"
                  id="addition-select"
                  className="form-control form-control-sm"
                >
                  <option value="one">One</option>
                  <option value="two">Two</option>
                  <option value="one">One</option>
                  <option value="two">Two</option>
                </select>
              </td>
              <td className="text-right">
                <button className="btn btn-sm btn-success" title="Add">
                  <span className="fa fa-fw fa-plus" />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        <hr />
        <h2>View Item Table</h2>

        <table className="table">
          <thead>
            <tr>
              <th width="10%">Status</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="submission-status submission-status--complete">
                  Test
                </span>
              </td>
              <td className="">
                <a href="/">Body Row 1, Col 1</a>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="" colSpan="2" />
            </tr>
          </tfoot>
        </table>
        <hr />
      </div>
    </div>
  </Fragment>
);
