import { Component } from 'react';
import { coreOauthAuthorizeUrl } from '../../utils/authentication';

export class OAuthPopup extends Component {
  constructor(props) {
    super(props);
    this.windowHandle = null;
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    if (this.windowHandle) {
      this.windowHandle.close();
    }
  }

  openPopup() {
    this.windowHandle = window.open(
      coreOauthAuthorizeUrl(),
      'KINOPS_WindowName',
      'menubar=no,location=no,resizable=yes,status=yes',
    );
    if (this.windowHandle) {
      window.__OAUTH_CALLBACK__ = token => {
        this.windowHandle.close();
        this.props.onSuccess(token);
      };
    } else {
      this.props.onPopupBlocked(true);
    }
  }

  componentDidMount() {
    this.openPopup();
    window.addEventListener('beforeunload', this.closePopup);
  }

  componentWillUnmount() {
    this.closePopup();
    window.removeEventListener('beforeunload', this.closePopup);
  }

  render() {
    return null;
  }
}
