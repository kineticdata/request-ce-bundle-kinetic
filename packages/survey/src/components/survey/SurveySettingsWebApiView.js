import React from 'react';
import HTTPSnippet from 'httpsnippet';
import { CodeViewer } from './CodeViewer';

const origin = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? // ? bundle.spaceLocation()
      window.location.origin
    : window.location.origin;

export const SurveySettingsWebApiView = ({ kappSlug }) => {
  const method = 'POST';
  const slug = 'survey-test';
  const publicRoute =
    kappSlug && `${origin()}/app/kapps/${kappSlug}/webApis/${slug}`;
  const snippet = new HTTPSnippet({
    method: method,
    url: `${publicRoute}?timeout=10`,
  });

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <h6>jQuery Example</h6>
        <CodeViewer
          language="js"
          value={snippet.convert('javascript', 'jquery', {
            indent: '\t',
          })}
        />
      </div>
      <div className="col-12 mb-3">
        <h6>Ruby Example</h6>
        <CodeViewer
          language="ruby"
          value={snippet.convert('ruby', {
            indent: '\t',
          })}
        />
      </div>
      <div className="col-12 mb-5">
        <h6>Curl</h6>
        <CodeViewer
          language="bash"
          value={snippet.convert('shell', 'curl', {
            indent: '\t',
          })}
        />
      </div>
    </div>
  );
};
