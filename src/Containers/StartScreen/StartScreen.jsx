import React from 'react';
import './StartScreen.css';

import Title from '../../Components/Title/Title';

import game from '../../game_modules/main';

import { connect } from 'react-redux';
import { SET_STORE_NAME, SET_GAME_STATE } from '../../actions/types';


class StartScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edited: false
    }

    this.handleStart = this.handleStart.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
  }

  componentDidMount() {
    
  }
  
  handleStart() {
    const newName = this.props.name;
    if (!newName || newName === '') {
      return;
    }
    game.init({ name: newName });
    this.props.setStarted(true);
  }

  handleNameInput(e) {
    if (e.charCode === 13) {
      this.handleStart();
    }
    if (!this.props.edited) {
      this.setState({ edited: true });
    }
  }

  render() {
    return (
      <div className="StartScreen primary-surface">
        <Title />
        <div className="NameInput">
          <div className="nameInputGroup">
            <label htmlFor="name" className="NameLabel">Name: </label>
            <input id="name" 
              value={this.props.name}
              type="text"
              onChange={(val) => this.props.setStoreName(val.target.value)}
              onKeyPress={this.handleNameInput}
            />
          </div>
          <button onClick={this.handleStart} 
            className="StartButton">
              Start!    
          </button>
        </div>
          
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    started: state.gameState.started,
    name: state.storeState.name,
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStoreName: (name) => dispatch({ type: SET_STORE_NAME, name: name }),
    setStarted: (value) => dispatch({ type: SET_GAME_STATE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);