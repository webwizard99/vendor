import React from 'react';
import './reset.css';
import './App.css';

import GameScreen from '../../Containers/GameScreen/GameScreen';
import StartScreen from '../../Containers/StartScreen/StartScreen';

import { connect } from 'react-redux';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.getMainView = this.getMainView.bind(this);
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

  render() {
    return (
      <div className="App">
        {this.getMainView()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    started: state.gameState.started
  }
}

export default connect(mapStateToProps)(App);