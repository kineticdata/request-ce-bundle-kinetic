import React, { Fragment } from 'react';

export const TypographyPage = () => (
  <Fragment>
    <div className="design-system-page">
      <div className="col-10">
        <h1>Typography</h1>
        <hr />
        <h2>Font Choice</h2>
        <span className="super-font">Aa</span>
        <p>
          Open Sans is a sans-serif typeface designed by Steve Matteson and
          commissioned by Google. According to Google, it was developed with an
          "upright stress, open forms and a neutral, yet friendly appearance"
        </p>
        <div className="cards__wrapper cards__wrapper--design-system">
          <div className="card card--design-system">
            <h1 className="type--light">Aa Zz</h1>
            <p>OpenSans Light</p>
          </div>
          <div className="card card--design-system">
            <h1 className="type--normal">Aa Zz</h1>
            <p>OpenSans Semi-Bold</p>
          </div>
          <div className="card card--design-system">
            <h1 className="type--bold">Aa Zz</h1>
            <p>OpenSans Bold</p>
          </div>
        </div>
        <hr />
        <h2>Headings</h2>
        <h1>H1. Streamline everyday work for teams</h1>
        <h2>H2. Streamline everyday work for teams</h2>
        <h3>H3. Streamline everyday work for teams</h3>
        <h4>H4. Streamline everyday work for teams</h4>
        <h5>H5. Streamline everyday work for teams</h5>
        <h6>H6. Streamline everyday work for teams</h6>
        <div className="flex-row">
          <div className="highlight">
            <pre>{`<h1>H1. Streamline everyday work for teams</h1>
<h2>H2. Streamline everyday work for teams</h2>
<h3>H3. Streamline everyday work for teams</h3>
<h4>H4. Streamline everyday work for teams</h4>
<h5>H5. Streamline everyday work for teams</h5>
<h6>H6. Streamline everyday work for teams</h6>`}</pre>
          </div>
        </div>
      </div>
      <hr />
      <h2>Paragraphs</h2>
      <h6>Body Default</h6>
      <p>
        In sed mauris montes, ultricies, platea et! Cum auctor placerat hac
        montes rhoncus quis pulvinar dolor placerat velit? Vut dapibus turpis
        aliquam lectus phasellus! Lundium mauris lacus duis nunc pellentesque
        tortor, placerat turpis eros, sagittis scelerisque? Pulvinar dis
        porttitor, massa sagittis pid, amet a enim enim.
      </p>
      <h6>Body Small</h6>
      <p>
        <small>
          In sed mauris montes, ultricies, platea et! Cum auctor placerat hac
          montes rhoncus quis pulvinar dolor placerat velit? Vut dapibus turpis
          aliquam lectus phasellus! Lundium mauris lacus duis nunc pellentesque
          tortor, placerat turpis eros, sagittis scelerisque? Pulvinar dis
          porttitor, massa sagittis pid, amet a enim enim.
        </small>
      </p>

      <div className="flex-row">
        <div className="highlight">
          <pre
          >{`<!-- paragraph -->
<p>In sed mauris montes, ultricies, platea et! Cum auctor placerat hac montes rhoncus quis pulvinar dolor placerat velit? Vut dapibus turpis aliquam lectus phasellus! Lundium mauris lacus duis nunc pellentesque tortor, placerat turpis eros, sagittis scelerisque? Pulvinar dis porttitor, massa sagittis pid, amet a enim enim.</p>

<!-- paragraph small -->
<p>
  <small>
    In sed mauris montes, ultricies, platea et! Cum auctor placerat hac montes
    rhoncus quis pulvinar dolor placerat velit? Vut dapibus turpis aliquam
    lectus phasellus! Lundium mauris lacus duis nunc pellentesque tortor,
    placerat turpis eros, sagittis scelerisque? Pulvinar dis porttitor, massa
    sagittis pid, amet a enim enim.
  </small>
</p>`}</pre>
        </div>
      </div>
      <hr />
      <h2>Lists</h2>
  <ul>
    <li>list item 1</li>
    <li>list item 2
      <ul>
        <li>list item 2.1</li>
        <li>list item 2.2</li>
        <li>list item 2.3</li>
      </ul>
    </li>
    <li>list item 3</li>
  </ul>

  <dl>
    <dt>description list term</dt>
    <dd>description list description</dd>
  </dl>
  <div className="flex-row">
    <div className="highlight">
      <pre
      >{`<!-- unordered list -->
<ul>
  <li>list item 1</li>
  <li>list item 2
    <ul>
      <li>list item 2.1</li>
      <li>list item 2.2</li>
      <li>list item 2.3</li>
    </ul>
  </li>
  <li>list item 3</li>
</ul>

<!-- description list -->
<dl>
  <dt>description list term</dt>
  <dd>description list description</dd>
</dl>
  `}</pre>
  </div>
</div>
      <hr/>
      {/*<h1> Line Height</h1>

      <p>
        In the context of an enterprise application, the need for longform text
        is quite rare. More often, application design involves many small bits
        of text that all represent the user’s data. This text is spaced
        intentionally to maintain distinction between different types and rows
        of data.
      </p>

      <p>
        As a result, we take a pragmatic approach to spacing and line height by
        resetting all margins and paddings to 0, and allowing the line-height
        property for all text to inherit a globally defined ratio of 1.5 of the
        text size. This allows designers and developers to easily opt-in to
        specific text spacing by leveraging our CSS Text and Spacing Utilities.
      </p>

      <p>
        We do provide a longform text CSS utility, which will result in our
        recommended vertical text rhythm for optimizing a balance between
        readability and space efficiency.
      </p>*/}
    </div>
  </Fragment>
);
