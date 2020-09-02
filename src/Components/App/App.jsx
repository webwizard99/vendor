import React from 'react';
import './reset.css';
import './App.css';

// game module imports
import GameScreen from '../../Containers/GameScreen/GameScreen';
import StartScreen from '../../Containers/StartScreen/StartScreen';
import ProfileViewer from '../../Containers/ProfileViewer/ProfileViewer';
import MobileGameScreen from '../../Containers/MobileGameScreen/MobileGameScreen';

// utility imports
import screenInfo from '../../Utilities/screenInfo';

// component imports
import MenuBar from '../../Components/MenuBar/MenuBar';

import { connect } from 'react-redux';
import * as actions from '../../actions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.getMainView = this.getMainView.bind(this);
    this.getProfileViewer = this.getProfileViewer.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.fetchUser();
    screenInfo.init();
  }

  getMainView() {
    const gameState = this.props.started;
    if (!gameState) {
      return (
        <StartScreen />
      )
    } else {
      if (this.props.isMobile) {
        return (
          <MobileGameScreen />
        )
      } else {
        return (
          <GameScreen />
        )
      }
    }
  }

  getProfileViewer() {
    const profileStatus = this.props.profileActive;
    if (profileStatus) {
      return (
        <ProfileViewer />
      )
    }
  }

  render() {
    return (
      <div className="App"
        ref={ref => {
          this.container = ref;
        }}>
        <MenuBar />
        {this.getMainView()}
        {this.getProfileViewer()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    started: state.gameState.started,
    profileActive: state.profile.active,
    isMobile: state.app.isMobile
  }
}

export default connect(mapStateToProps, actions)(App);