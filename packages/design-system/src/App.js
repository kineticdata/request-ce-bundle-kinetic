import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import { GettingStartedPage } from './GettingStartedPage';
import { ButtonsPage } from './ButtonsPage';

import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import 'common/src/assets/styles/master.scss';

class App extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-3">
          <Link to="/buttons" className="btn btn-primary btn-lg btn-block">
            Buttons
          </Link>
        </div>
        <div className="col-9">
          <Route path="/" exact component={GettingStartedPage} />
          <Route path="/buttons" exact component={ButtonsPage} />
        </div>
      </div>
    );
  }
}

export default App;
