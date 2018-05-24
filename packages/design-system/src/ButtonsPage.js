import React from 'react';

export const ButtonsPage = () => (
  <div className="design-system-page design-system-page--buttons">
    <div className="col-10">
      <h1>Buttons</h1>
      <hr />
      <div className="flex-row">
        <h2>kinops Examples</h2>
        <button type="button" className="btn btn-primary">
          Primary
        </button>
        <button type="button" className="btn btn-secondary">
          Secondary
        </button>
        <button type="button" className="btn btn-inverse ">
          Inverse
        </button>
        <button type="button" className="btn btn-link ">
          Link
        </button>
        <button type="button" className="btn btn-outline-danger ">
          Delete
        </button>

        <button type="button" className="btn btn-subtle ">
          Subtle
        </button>
        <button type="button" className="btn btn-success">
          Add
        </button>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<button type="button" className="btn btn-primary">Primary</button>
<button type="button" className="btn btn-secondary">Secondary</button>
<button type="button" className="btn btn-inverse ">Inverse</button>
<button type="button" className="btn btn-link ">Link</button>
<button type="button" className="btn btn-outline-danger ">Delete</button>
<button type="button" className="btn btn-subtle ">Subtle</button>
<button type="button" className="btn btn-success ">Add</button>`}
            </pre>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex-row">
        <h2>Button Tags</h2>
        <a className="btn btn-primary" href="" role="button">
          Link
        </a>
        <button className="btn btn-primary" type="submit">
          Button
        </button>
        <input className="btn btn-primary" type="button" value="Input" />
        <input className="btn btn-primary" type="submit" value="Submit" />
        <input className="btn btn-primary" type="reset" value="Reset" />
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<a className="btn btn-primary" href="#" role="button">Link</a>
<button className="btn btn-primary" type="submit">Button</button>
<input className="btn btn-primary" type="button" value="Input" />
<input className="btn btn-primary" type="submit" value="Submit" />
<input className="btn btn-primary" type="reset" value="Reset" />`}
            </pre>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex-row">
        <h2>Button Sizes</h2>
        <div className="flex-row button-example">
          <button type="button" className="btn btn-primary btn-lg">
            Large button
          </button>
          <button type="button" className="btn btn-secondary btn-lg">
            Large button
          </button>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<button type="button" className="btn btn-primary btn-lg">Large button</button>
<button type="button" className="btn btn-secondary btn-lg">Large button</button>`}
            </pre>
          </div>
        </div>
        <div className="flex-row">
          <button type="button" className="btn btn-primary btn-sm">
            Small button
          </button>
          <button type="button" className="btn btn-secondary btn-sm">
            Small button
          </button>
          <div className="flex-row">
            <div className="highlight">
              <pre>
                {`<button type="button" className="btn btn-primary btn-sm">Small button</button>
<button type="button" className="btn btn-secondary btn-sm">Small button</button>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex-row">
        <h2>Active State</h2>
        <a
          href=""
          className="btn btn-primary btn-lg active"
          role="button"
          aria-pressed="true"
        >
          Primary link
        </a>
        <a
          href=""
          className="btn btn-secondary btn-lg active"
          role="button"
          aria-pressed="true"
        >
          Link
        </a>
        <a
          href=""
          className="btn btn-inverse btn-lg active"
          role="button"
          aria-pressed="true"
        >
          Inverse
        </a>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<a href="#" className="btn btn-primary btn-lg active" role="button" aria-pressed="true">Primary link</a>
<a href="#" className="btn btn-secondary btn-lg active" role="button" aria-pressed="true" >Link</a>
<a href="#" className="btn btn-inverse btn-lg active" role="button" aria-pressed="true" > Inverse </a>`}
            </pre>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex-row">
        <h2>Disabled State</h2>
        <button type="button" className="btn btn-lg btn-primary" disabled>
          Primary button
        </button>
        <button type="button" className="btn btn-secondary btn-lg" disabled>
          Button
        </button>
        <button type="button" className="btn btn-inverse btn-lg" disabled>
          Inverse
        </button>
        <a
          href=""
          className="btn btn-primary btn-lg disabled"
          role="button"
          aria-disabled="true"
        >
          Primary link
        </a>
        <a
          href=""
          className="btn btn-secondary btn-lg disabled"
          role="button"
          aria-disabled="true"
        >
          Link
        </a>
        <a
          href=""
          className="btn btn-inverse btn-lg disabled"
          role="button"
          aria-disabled="true"
        >
          Inverse
        </a>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<button type="button" className="btn btn-lg btn-primary" disabled>Primary button</button>
<button type="button" className="btn btn-secondary btn-lg" disabled>Button</button>
<button type="button" className="btn btn-inverse btn-lg" disabled>Inverse</button>
<a href="#" className="btn btn-primary btn-lg disabled" role="button" aria-disabled="true">Primary link</a>
<a href="#" className="btn btn-secondary btn-lg disabled" role="button" aria-disabled="true">Link</a>
<a href="#" className="btn btn-inverse btn-lg disabled" role="button" aria-disabled="true">Inverse</a>`}
            </pre>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex-row">
        <h2>Icon Buttons</h2>
        <button className="btn btn-icon">
          <span className="fa fa-plus" />
        </button>
        <button className="btn btn-icon">
          <span className="fa fa-plus" />
          {` `}Button w/Icon
        </button>
        <button type="submit" className="btn btn-subtle btn-icon">
          <span className="fa fa-fw fa-paper-plane" />
        </button>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<button className="btn btn-icon"><span className="fa fa-plus" /></button>
<button className="btn btn-icon"><span className="fa fa-plus" /> Button w/Icon</button>
<button type="submit" className="btn btn-subtle btn-icon"><span className="fa fa-fw fa-paper-plane" /></button>`}
            </pre>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex-row">
        <h2>Button Groups</h2>
        <div role="group" className="btn-group">
          <a disabled="" href="" className="active btn btn-inverse disabled">
            <span className="icon">
              <span className="fa fa-fw fa-caret-left" />
            </span>
          </a>
          <a href="" className="btn btn-inverse ">
            <span className="icon">
              <span className="fa fa-fw fa-caret-right" />
            </span>
          </a>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<div role="group" className="btn-group btn-group-sm">
  <a disabled="" href="#" className="active btn btn-inverse disabled" >
    <span className="icon">
      <span className="fa fa-fw fa-caret-left" />
    </span>
  </a>
  <a href="#" className="btn btn-inverse">
    <span className="icon">
      <span className="fa fa-fw fa-caret-right" />
    </span>
  </a>
</div>`}
            </pre>
          </div>
        </div>

        <div className="flex-row">
          <div className="btn-group btn-group-sm">
            <button className="btn btn-danger">
              <span className="fa fa-fw fa-close" />
            </button>
            <a className="btn btn-primary" href="">
              <span className="fa fa-fw fa-pencil" />
            </a>
          </div>
        </div>
        <div className="flex-row">
          <div className="highlight">
            <pre>
              {`<div className="btn-group btn-group-sm">
  <button className="btn btn-danger">
    <span className="fa fa-fw fa-close" />
  </button>
  <a className="btn btn-primary" href="">
    <span className="fa fa-fw fa-pencil" />
  </a>
</div>
        `}
            </pre>
          </div>
        </div>
      </div>
      <hr />
      <hr />
      {/* Bootstrap */}
      <div className="flex-row">
        <h2>Bootstrap Examples</h2>
        <button type="button" className="btn btn-primary">
          Primary
        </button>
        <button type="button" className="btn btn-secondary">
          Secondary
        </button>
        <button type="button" className="btn btn-success">
          Success
        </button>
        <button type="button" className="btn btn-danger">
          Danger
        </button>
        <button type="button" className="btn btn-warning">
          Warning
        </button>
        <button type="button" className="btn btn-info">
          Info
        </button>
        <button type="button" className="btn btn-light">
          Light
        </button>
        <button type="button" className="btn btn-dark">
          Dark
        </button>
      </div>
      <hr />
      <div className="flex-row">
        <h2>Bootstrap Outline Buttons</h2>
        <button type="button" className="btn btn-outline-primary">
          Primary
        </button>
        <button type="button" className="btn btn-outline-secondary">
          Secondary
        </button>
        <button type="button" className="btn btn-outline-success">
          Success
        </button>
        <button type="button" className="btn btn-outline-danger">
          Danger
        </button>
        <button type="button" className="btn btn-outline-warning">
          Warning
        </button>
        <button type="button" className="btn btn-outline-info">
          Info
        </button>
        <button type="button" className="btn btn-outline-light">
          Light
        </button>
        <button type="button" className="btn btn-outline-dark">
          Dark
        </button>
      </div>
      <hr />
    </div>
  </div>
);
