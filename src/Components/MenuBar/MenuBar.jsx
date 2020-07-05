import React from 'react';
import { connect } from 'react-redux';
import './MenuBar.css';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.renderLogin = this.renderLogin.bind(this);
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
  
  render() {
    return (
      <div className="MenuBar">
        <span>MenuBar </span>
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