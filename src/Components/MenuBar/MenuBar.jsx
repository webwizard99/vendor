import React from 'react';
import './MenuBar.css';

// redux imports
import { connect } from 'react-redux';
import { SET_PROFILE_ACTIVE } from '../../actions/types';

// utility imports
import screenInfo from '../../Utilities/screenInfo';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileOpen: false
    }

    this.handleProfileActive = this.handleProfileActive.bind(this);
    this.getLoginContainer = this.getLoginContainer.bind(this);
    this.renderProfileLink = this.renderProfileLink.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.renderEditorLink = this.renderEditorLink.bind(this);
    this.handleMobileOpen = this.handleMobileOpen.bind(this);
  }

  handleProfileActive() {
    if (!this.props.profileActive) {
      this.props.setProfileActive(true);
    }
    this.handleMobileOpen();
  }

  handleMobileOpen() {
    if (this.props.profileActive && !this.state.mobileOpen) {
      return;
    }
    this.setState({ mobileOpen: !this.state.mobileOpen});
  }

  renderProfileLink() {
    switch(this.props.auth) {
      case null:
        return '';
      case false:
        return '';
      default:
        return <li key="profile" class="profileLink" onClick={this.handleProfileActive}>profile</li>
    }
  }

  renderLogin() {
    switch(this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li key="login"><a href="/auth/facebook" className="facebookLogo"><span>f</span></a></li>
        );
      default:
        return (
          <li key="login"><a href="/api/logout">logout</a></li>
        );
    }
  }

  renderEditorLink() {
    switch(this.props.auth) {
      case null:
        return false;
      case false:
        return false;
      default:
        const userType = this.props.auth.type;
        if (userType === 'owner' && screenInfo.getIsPc()) {
          return (
            <li key="editorLink"><a className="EditorLink" href="/editor">editor</a></li>
          )
        } else {
          return false;
        }
    }

  }

  getLoginContainer() {
    if (!this.props.isPc) {
      return (
        <div className="hamburgerContainer"
          onClick={this.handleMobileOpen}>
          <div className="hamburgerLine"></div>
          <div className="hamburgerLine"></div>
          <div className="hamburgerLine"></div>
        </div>
      )
    }
    return (
      <ul className="LoginContainer">
        {this.renderProfileLink()}
        {this.renderEditorLink()}
        {this.renderLogin()}
      </ul>
    )
  }

  getMobileMenu() {
    if (!this.props.isPc && this.state.mobileOpen) {
      let mobileOffsetStyle = {};
      let menuOffsets = 1;
        if (this.props.auth) {
          menuOffsets += 1;
        }
        if (!this.props.isPc) {
          mobileOffsetStyle.height = `calc(${(menuOffsets * 1.8)}rem + ${(menuOffsets * 2) * 0.8}rem - 1px`;
        }
        
        
      return (
        <div className="mobileMenuContainer"
          onClick={this.handleMobileOpen}>
          <ul className="LoginContainer mobileMenu"
            style={mobileOffsetStyle}
            >
            {this.renderProfileLink()}
            {this.renderEditorLink()}
            {this.renderLogin()}
          </ul>
        </div>
        
      )
    }
  }
  
  render() {
    return (
      <div className="MenuBar">
        <span className="MenuTitle"><a href="/">VENDOR</a></span>
        {this.getLoginContainer()}
        {this.getMobileMenu()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profileActive: state.profile.active,
    isMobile: state.app.isMobile,
    isPc: state.app.isPc
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProfileActive: (value) => dispatch({ type: SET_PROFILE_ACTIVE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);