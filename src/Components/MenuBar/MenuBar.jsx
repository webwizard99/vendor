import React from 'react';
import './MenuBar.css';

// redux imports
import { connect } from 'react-redux';
import { SET_PROFILE_ACTIVE } from '../../actions/types';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleProfileActive = this.handleProfileActive.bind(this);
    this.renderProfileLink = this.renderProfileLink.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.renderEditorLink = this.renderEditorLink.bind(this);
  }

  handleProfileActive() {
    if (!this.props.profileActive) {
      this.props.setProfileActive(true);
    }
  }

  renderProfileLink() {
    switch(this.props.auth) {
      case null:
        return '';
      case false:
        return '';
      default:
        return <li key="profile" onClick={this.handleProfileActive}><a href="#">Profile</a></li>
    }
  }

  renderLogin() {
    
    switch(this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li key="login"><a href="/auth/facebook">Login with Facebook</a></li>
        );
      default:
        return (
          <li key="login"><a href="/api/logout">Logout</a></li>
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
        if (userType === 'owner') {
          return (
            <li key="editorLink"><a className="EditorLink" href="/editor">editor</a></li>
          )
        } else {
          return false;
        }
    }

  }
  
  render() {
    return (
      <div className="MenuBar">
        <span className="MenuTitle"><a href="/">VENDOR</a></span>
        <ul className="LoginContainer">
          {this.renderProfileLink()}
          {this.renderEditorLink()}
          {this.renderLogin()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profileActive: state.profile.active
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProfileActive: (value) => dispatch({ type: SET_PROFILE_ACTIVE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);