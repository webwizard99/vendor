import React from 'react';
import { connect } from 'react-redux';
import './MenuBar.css';

class MenuBar extends React.Component {
  render() {
    return (
      <div>MenuBar  (auth: {this.props.auth})</div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(MenuBar);