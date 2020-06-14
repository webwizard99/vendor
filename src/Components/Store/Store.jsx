import React from 'react';
import './Store.css';

import gameStore from '../../Utilities/store';

import { SET_STORE_GOLD } from '../../actions/types';
import { connect } from 'react-redux';

class Store extends React.Component {
  constructor(props) {
    super(props);
  }

  // ~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*
  // ~~*~~*~*~~* lifecycle methods ~~*~~*~*~~*~
  // ~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*
  
  componentDidMount() {
    const currentGold = gameStore.getGold();
    this.props.setStoreGold(currentGold);
  }

  
  
  render() {
    return (
      <div className="Store">
        <div className="StoreMenuBar">
          <h2 className="StoreName">{this.props.storeName}</h2>
          <span className="Inspect">&#128269; </span>
          <div className="GoldDisplay">
            <span className="CoinSymbol">&#x2689; </span>
            {this.props.gold}
          </div>
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    storeName: state.storeState.name,
    gold: state.storeState.gold

  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStoreGold: (newGold) => dispatch({ type: SET_STORE_GOLD, amount: newGold })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);