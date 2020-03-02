import React from 'react';
import HTTPSnippet from 'httpsnippet';
import { CodeViewer } from '../shared/CodeViewer';

export const SurveySettingsWebApiView = ({ kappSlug, formSlug }) => {
  const method = 'POST';
  const publicRoute =
    kappSlug &&
    `${window.location.origin}/app/kapps/${kappSlug}/webApis/${formSlug}`;
  const snippet = new HTTPSnippet({
    method: method,
    url: `${publicRoute}?timeout=10`,
    postData: {
      mimeType: 'application/x-www-form-urlencoded',
      params: [
        {
          name: 'surveySlug',
          value: formSlug,
        },
        {
          name: 'userId',
          value: 'name@example.com',
        },
        {
          name: 'data',
          value: 'varies by initiating system',
        },
      ],
    },
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
