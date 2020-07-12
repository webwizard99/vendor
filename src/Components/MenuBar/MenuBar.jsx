import React from 'react';
import { connect } from 'react-redux';
import './MenuBar.css';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.renderLogin = this.renderLogin.bind(this);
    this.renderEditorLink = this.renderEditorLink.bind(this);
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
        <span className="MenuTitle">VENDOR</span>
        <ul className="LoginContainer">
          {this.renderEditorLink()}
          {this.renderLogin()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(MenuBar);