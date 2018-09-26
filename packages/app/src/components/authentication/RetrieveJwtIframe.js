import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { coreOauthAuthorizeUrl } from '../../utils/authentication';

const RetrieveJwt = ({ frameRef }) => (
  <iframe
    title="oauth-jwt iframe"
    src={coreOauthAuthorizeUrl()}
    style={{ display: 'none' }}
    ref={frameRef}
  />
);

export const RetrieveJwtIframe = compose(
  withHandlers(() => {
    let frameRef;
    return {
      frameRef: () => ref => (frameRef = ref),
      getFrameRef: () => () => frameRef,
      handleFrameLoad: ({ handleJwt }) => () => {
        if (handleJwt) {
          handleJwt(frameRef);
        }
      },
    };
  }),
  lifecycle({
    componentWillMount() {
      window.__OAUTH_CALLBACK__ = token => {
        if (typeof this.props.onSuccess === 'function') {
          this.props.onSuccess(token);
        }
      };
    },
    componentDidMount() {
      this.props.getFrameRef().onload = this.props.handleFrameLoad;
    },
  }),
)(RetrieveJwt);
