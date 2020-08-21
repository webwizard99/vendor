import React from 'react';
import './Store.css';

// import gameStore from '../../Utilities/store';

import StoreInventory from '../StoreInventory/StoreInventory';

import { SET_STORE_GOLD } from '../../actions/types';
import { fetchGold } from '../../actions';
import { connect } from 'react-redux';

class Store extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  // ~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*
  // ~~*~~*~*~~* lifecycle methods ~~*~~*~*~~*~
  // ~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*
  
  componentDidMount() {
    this.props.fetchGold();
  }  
  
  render() {
    return (
      <div className="Store">
        <div className="StoreMenuBar">
          <h2 className="StoreName">{this.props.storeName}</h2>
          <span className="Inspect" role="img" aria-label="inspect">&#128269; </span>
          <div className="GoldDisplay">
            <span className="CoinSymbol" role="img" aria-label="coin">&#x2689; </span>
            {this.props.gold}
          </div>
        </div>
        <StoreInventory />
        
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
    setStoreGold: (newGold) => dispatch({ type: SET_STORE_GOLD, amount: newGold }),
    fetchGold: () => dispatch(fetchGold())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);