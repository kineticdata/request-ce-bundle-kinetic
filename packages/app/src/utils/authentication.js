import axios from 'axios';
import { bundle } from 'react-kinetic-core';

export const OAUTH_CLIENT_ID = encodeURIComponent('kinops');

export const login = (username, password) =>
  axios.post(
    `${bundle.spaceLocation()}/app/login.do`,
    {
      j_username: username,
      j_password: password,
    },
    {
      __bypassAuthInterceptor: true,
    },
  );

export const coreOauthAuthorizeUrl = () => {
  return `${bundle.spaceLocation()}/app/oauth/authorize?grant_type=implicit&client_id=${OAUTH_CLIENT_ID}&response_type=token`;
};
