import React from 'react';
import { Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { connect } from './redux/store';
import { ErrorUnexpected, Loading } from 'common';
import { I18n } from '@kineticdata/react';

import { Discussions } from './components/Discussions';
import { Discussion } from './components/Discussion';

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      main: (
        <I18n>
          <main className={`package-layout package-layout--discussions`}>
            <Router>
              <Discussions path="/" />
              <Discussion path="/:id" />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = {};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {},
  }),
);

export const App = enhance(AppComponent);
