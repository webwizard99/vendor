import React from 'react';
import './GameScreen.css';

// import Title from '../../Components/Title/Title';
import Store from '../../Components/Store/Store';
import Suppliers from '../../Components/Suppliers/Suppliers';
import Days from '../../Components/Days/Days';
import Details from '../../Components/Details/Details';

import { connect } from 'react-redux';

class GameScreen extends React.Component {
  render() {
    return (
      <div className="GameScreen flex-container primary-light">
        <div className="CommerceColumn">
          <Days />
          <Store />
          <Suppliers />
        </div>
        <Details />
        
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