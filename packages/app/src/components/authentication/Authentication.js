import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router-dom';
import { actions } from '../../redux/modules/app';
import { Login, LoginModal } from './Login';
import { ResetPassword } from './ResetPassword';
import { CreateAccount } from './CreateAccount';

export const Authentication = compose(
  connect(
    state => ({
      authenticated: state.app.authenticated,
      authRedirect: state.app.authRedirect,
    }),
    {
      setAuthenticated: actions.setAuthenticated,
    },
  ),
)(
  ({
    loggedIn,
    loginProps,
    timedOut,
    authenticated,
    setAuthenticated,
    authRedirect,
    location,
    children,
  }) => {
    useEffect(
      () => {
        setAuthenticated(loggedIn);
      },
      [loggedIn, setAuthenticated, timedOut],
    );

    return (
      <>
        {timedOut && <LoginModal loginProps={loginProps} />}
        <Switch>
          {authenticated ? (
            <Redirect
              path={['/login', '/reset-password', '/create-account']}
              to={authRedirect || '/'}
            />
          ) : (
            [
              <Route path="/login" key="login">
                <Login loginProps={loginProps} />
              </Route>,
              <Route
                path="/reset-password/:token?"
                key="reset"
                component={ResetPassword}
              />,
              <Route
                path="/create-account"
                key="create"
                component={CreateAccount}
              />,
            ]
          )}
          <Route path="/">{children}</Route>
        </Switch>
      </>
    );
  },
);
