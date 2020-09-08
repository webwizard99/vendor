import React from 'react';
import './MobileGameScreen.css';

import Store from '../../Components/Store/Store';
import MobileMenu from '../../Components/MobileMenu/MobileMenu';

// redux imports
import { connect } from 'react-redux';

class MobileGameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'store'
    }
  }

  getCurrentScreen() {
    switch(this.props.mobileScreen) {
      case 'store':
        return <Store />
      default:
        return 'Nothing to display'
    }
  }
  
  render() {
    return (
      <div className="MobileGameScreen">
        <MobileMenu />
        {this.getCurrentScreen()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mobileScreen: state.mobileMenu.screen
  }
}

export default connect(mapStateToProps)(MobileGameScreen);