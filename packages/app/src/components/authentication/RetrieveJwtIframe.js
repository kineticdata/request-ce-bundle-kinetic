import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { coreOauthAuthorizeUrl } from '../../utils/authentication';

const RetrieveJwt = ({ retrieveJwt, frameRef }) => {
  return retrieveJwt ? (
    <iframe
      title="oauth-jwt iframe"
      src={coreOauthAuthorizeUrl()}
      style={{ display: 'none' }}
      ref={frameRef}
    />
  ) : null;
};

export const RetrieveJwtIframe = compose(
  withHandlers(() => {
    let frameRef;
    return {
      frameRef: () => ref => (frameRef = ref),
      getFrameRef: () => () => frameRef,
      handleFrameLoad: ({ retrieveJwt, handleJwt }) => () => {
        if (retrieveJwt && handleJwt) {
          handleJwt(frameRef);
        }
      },
    };
  }),
  lifecycle({
    componentDidMount() {
      this.props.getFrameRef().onload = this.props.handleFrameLoad;
    },
  }),
)(RetrieveJwt);
