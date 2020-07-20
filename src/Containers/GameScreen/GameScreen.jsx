import React from 'react';
import './GameScreen.css';

import Title from '../../Components/Title/Title';
import Store from '../../Components/Store/Store';
import Days from '../../Components/Days/Days';

import { connect } from 'react-redux';

class GameScreen extends React.Component {
  render() {
    return (
      <div className="GameScreen">
        <Title />
        <Store />
        <Days />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    storeName: state.storeState.name
  }
}

export default connect(mapStateToProps)(GameScreen);