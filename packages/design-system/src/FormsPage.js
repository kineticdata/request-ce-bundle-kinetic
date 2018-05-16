import React, { Fragment } from 'react';

export const FormsPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Forms</h1>
        <hr />
        <h2>Basic Input</h2>
        <form>
          <div className="form-group required">
            <label for="name">Display Name</label>
            <input
              id="name"
              name="name"
              className="form-control"
              value="Administrators"
            />
          </div>
        </form>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<form>
  <div className="form-group required">
    <label for="name">Display Name</label>
    <input
      id="name"
      name="name"
      className="form-control"
      value="Administrators"
    />
  </div>
</form>`}</pre>
          </div>
        </div>
      </div>
      <hr />
      <h2>Basic Textarea</h2>
      <form>
        <div className="form-group">
          <label htmlFor="textarea">Textarea label</label>
        </div>
        <textarea name="textarea" className="form-control" rows="3" />
      </form>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<form>
  <div className="form-group">
    <label htmlFor="textarea">Textarea label</label>
  </div>
  <textarea name="textarea" className="form-control" rows="3" />
</form>`}</pre>
        </div>
      </div>
      <hr />
      <h2>Basic Select</h2>
      <form>
        <div className="form-group">
          <label htmlFor="select">Select Label</label>
          <select name="select" id="select" className="form-control">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <div className="form-group">
          <label for="exampleFormControlSelect2">Example multiple select</label>
          <select
            multiple
            className="form-control"
            id="exampleFormControlSelect2"
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
      </form>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<form>
  <div className="form-group">
    <label htmlFor="select">Select Label</label>
    <select name="select" id="select" className="form-control">
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  </div>

  <div className="form-group">
    <label for="exampleFormControlSelect2">Example multiple select</label>
    <select
      multiple
      className="form-control"
      id="exampleFormControlSelect2"
    >
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
</form>`}</pre>
        </div>
      </div>
      <hr />
      <h2>File Input</h2>
      <form>
        <div className="form-group">
          <label for="exampleFormControlFile1">Example file input</label>
          <input
            type="file"
            className="form-control-file"
            id="exampleFormControlFile1"
          />
        </div>
      </form>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<form>
  <div className="form-group">
    <label for="exampleFormControlFile1">Example file input</label>
    <input
      type="file"
      className="form-control-file"
      id="exampleFormControlFile1"
    />
  </div>
</form>`}</pre>
        </div>
      </div>
      <hr />
      <h2>Basic Checkbox </h2>
      <form>
        <label htmlFor="checkbox">
          <input id="checkbox" type="checkbox" /> Checkbox
        </label>
        <label htmlFor="checkbox">
          <input id="checkbox" type="checkbox" checked /> Checkbox
        </label>
      </form>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<form>
  <label htmlFor="checkbox">
    <input id="checkbox" type="checkbox" /> Checkbox
  </label>
  <label htmlFor="checkbox">
    <input id="checkbox" type="checkbox" checked /> Checkbox
  </label>
</form>`}</pre>
        </div>
      </div>
      <hr />
      <h2>Basic Radio </h2>
      <form>
        <label htmlFor="radio">
          <input id="radio" type="radio" /> Radio
        </label>
        <label htmlFor="radio">
          <input id="radio" type="radio" checked /> Radio
        </label>
      </form>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<form>
  <label htmlFor="radio">
    <input id="radio" type="radio" /> Radio
  </label>
  <label htmlFor="radio">
    <input id="radio" type="radio" checked /> Radio
  </label>
</form>`}</pre>
        </div>
      </div>
      <hr />
      <h2>Search Bar</h2>
      <div className="search-box">
        <form className="search-box__form">
          <input type="text" placeholder="Search..." value="" />
          <button type="submit">
            <span className="fa fa-search" />
          </button>
        </form>
      </div>
      <div className="flex-row">
        <div className="highlight">
          <pre>{`<div className="search-box">
  <form className="search-box__form">
    <input type="text" placeholder="Search..." value="" />
    <button type="submit">
      <span className="fa fa-search"></span>
    </button>
  </form>
</div>`}</pre>
        </div>
      </div>
    </div>
  </Fragment>
);
