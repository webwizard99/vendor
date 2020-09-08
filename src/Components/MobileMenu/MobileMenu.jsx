import React from 'react';
import './MobileMenu.css';

// redux imports
import { connect } from 'react-redux';

class MobileMenu extends React.Component {
  render() {
    return (
      <div className="MobileMenu">
        {this.props.mobileScreen}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mobileScreen: state.mobileMenu.screen
  }
}

export default connect(mapStateToProps)(MobileMenu);