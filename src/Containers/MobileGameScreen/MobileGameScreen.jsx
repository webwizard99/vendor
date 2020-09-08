import React from 'react';
import './MobileGameScreen.css';

import Store from '../../Components/Store/Store';
import Suppliers from '../../Components/Suppliers/Suppliers';
import MobileMenu from '../../Components/MobileMenu/MobileMenu';

// redux imports
import { connect } from 'react-redux';

// utility imports
import mobileScreens from '../../Utilities/mobileScreens';

class MobileGameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'store'
    }
  }

  getCurrentScreen() {
    const allScreens = mobileScreens.getAllScreens();
    switch(this.props.mobileScreen) {
      case allScreens.store:
        return <Store />;
      case allScreens.suppliers:
        return <Suppliers />;
      default:
        return 'Nothing to display';
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