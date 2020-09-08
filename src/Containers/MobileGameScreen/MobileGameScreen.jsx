import React from 'react';
import './MobileGameScreen.css';

import Store from '../../Components/Store/Store';

class MobileGameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'store'
    }
  }

  getCurrentScreen() {
    switch(this.state.currentScreen) {
      case 'store':
        return <Store />
      default:
        return 'Nothing to display'
    }
  }
  
  render() {
    return (
      <div className="MobileGameScreen">
        {this.getCurrentScreen()}
      </div>
    )
  }
}

export default MobileGameScreen;