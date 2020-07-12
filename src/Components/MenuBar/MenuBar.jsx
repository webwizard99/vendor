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
          <li><a href="/auth/facebook">Login with Facebook</a></li>
        );
      default:
        return (
          <li><a href="/api/logout">Logout</a></li>
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
            <a className="EditorLink" href="/editor">editor</a>
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
        {this.renderEditorLink()}
        <ul className="LoginContainer">
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