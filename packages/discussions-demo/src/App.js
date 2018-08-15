import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import { actions } from 'discussions/src/redux/modules/discussions';

import { LoginForm } from './components/LoginForm';
import { ConnectionForm } from './components/ConnectionForm';

import { DiscussionsList } from './components/DiscussionsList';
import { DiscussionsContainer } from './components/DiscussionsContainer';

import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import 'common/src/assets/styles/master.scss';
import 'app/src/assets/styles/master.scss';
import 'services/src/assets/styles/master.scss';
import './assets/styles/master.scss';

class App extends Component {
  componentWillMount() {
    const token = localStorage.getItem('jwt');
    const host = 'localhost';
    const port = '7070';

    // Set the token in the store for future requests.
    this.props.setToken(token || '');

    // If we already have a token attempt to connect to the default host.
    if (token) {
      console.log('Attempting to auto connect.');
      this.props.connect({ host, port, token });
    }
  }

  handleConnect = async (host, port) => {
    this.props.connect({ host, port, token: this.props.token });
  };

  handleLogin = async (userInput, passInput) => {
    const result = await axios.request({
      method: 'post',
      url: `http://localhost:7071/acme/app/api/v1/authenticate`,
      data: {
        username: userInput,
        password: passInput,
      },
    });

    if (result.data.jwt) {
      localStorage.setItem('jwt', result.data.jwt);
      this.props.setToken(result.data.jwt);
    }
  };

  render() {
    const { connected, identified, token } = this.props;

    return (
      <div className="App">
        <div className="row">
          <div className="col">
            <div>Connected: {`${connected}`}</div>
            <div>Identified: {`${identified}`}</div>
          </div>
        </div>
        {!connected && (
          <div className="row">
            {token === '' && (
              <div className="col">
                <LoginForm handleLogin={this.handleLogin} />
              </div>
            )}
            {token !== '' && (
              <div className="col">
                <ConnectionForm handleConnect={this.handleConnect} />
              </div>
            )}
          </div>
        )}

        <div className="row">
          {connected &&
            identified && (
              <div className="col-3">
                <DiscussionsList />
              </div>
            )}
          <div className="col">
            <DiscussionsContainer />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.discussions.discussions.token,
  connected: state.discussions.discussions.connected,
  identified: state.discussions.discussions.identified,
});

const mapDispatchToProps = {
  setToken: actions.setToken,
  connect: actions.connect,
  setConnected: actions.setConnected,
  setIdentified: actions.setIdentified,
};

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
