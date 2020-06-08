import React from 'react';
import './Days.css';

import { connect } from 'react-redux'

class Days extends React.Component {
  render() {
    return (
      <div>
        Day: {this.props.days}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    days: state.days.days
  }
}

export default connect(mapStateToProps)(Days);