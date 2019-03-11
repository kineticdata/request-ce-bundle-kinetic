import axios from 'axios';
import { bundle } from 'react-kinetic-lib';

export const OAUTH_CLIENT_ID =
  process.env.NODE_ENV === 'development'
    ? encodeURIComponent('kinetic-bundle-dev')
    : encodeURIComponent('kinetic-bundle');

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
