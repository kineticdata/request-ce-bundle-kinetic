import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../../app/src';
// import { ConnectedI18nProvider } from '@kineticdata/react';

export default (content, container) =>
  ReactDOM.render(
    <Provider store={store}>
      {/* <ConnectedI18nProvider mergeTranslations={true}> */}
      {content}
      {/* </ConnectedI18nProvider> */}
    </Provider>,
    container,
  );
