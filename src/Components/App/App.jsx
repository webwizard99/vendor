import React from 'react';
import './reset.css';
import './App.css';

import GameScreen from '../../Containers/GameScreen/GameScreen';
import StartScreen from '../../Containers/StartScreen/StartScreen';
import ProfileViewer from '../../Containers/ProfileViewer/ProfileViewer';

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
  }

  getMainView() {
    const gameState = this.props.started;
    if (!gameState) {
      return (
        <StartScreen />
      )
    } else {
      return (
        <GameScreen />
      )
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
      <div className="App">
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
    profileActive: state.profile.active
  }
}

export default connect(mapStateToProps, actions)(App);