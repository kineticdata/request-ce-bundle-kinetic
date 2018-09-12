import { compose, withState, lifecycle } from 'recompose';
import { withRouter } from 'react-router';
import { coreOauthAuthorizeUrl } from '../../utils/authentication';

export const OAuthPopup = compose(
  withRouter,
  withState('windowHandle', 'setWindowHandle', null),
  lifecycle({
    componentDidMount() {
      const windowHandle = window.open(
        coreOauthAuthorizeUrl(),
        'KINOPS_WindowName',
        'menubar=no,location=no,resizable=yes,status=yes',
      );
      if (windowHandle) {
        window.__OAUTH_CALLBACK__ = token => {
          windowHandle.close();
          this.props.onSuccess(token);
        };
      } else {
        this.props.setPopupBlocked(true);
      }
    },
  }),
)(() => null);
