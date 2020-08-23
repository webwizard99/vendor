import React from 'react';
import './StoreInventory.css';

import { connect } from 'react-redux';
import { SET_STORE_INVENTORY } from '../../actions/types';

import storeInventory from '../../game_modules/storeInventory';
import storeItems from '../../game_modules/items';

class StoreInventory extends React.Component {
  constructor(props) {
    super(props);
    
    this.getInventoryItems = this.getInventoryItems.bind(this);
  }

  componentDidMount() {
    const newInventory = JSON.parse(JSON.stringify(storeInventory.getStoreInventory()));
    this.props.setInventory(newInventory);
  }

  getInventoryItems() {
    if (this.props.inventory && this.props.inventory.length > 0) {
      let composedInventory = [];
      this.props.inventory.forEach(itemId => {
        let thisItem = storeItems.getItem(itemId);
        composedInventory.push(itemId);
      });
      return (
        <div>{composedInventory.map(item => {
          return (
            <div className="InventoryItem itemBackground" key={item.id}>
              <span className="InventoryItemName">{item.name}</span>
              <div className="ItemValueGroup">
                <span className="CoinSymbol">&#x2689; </span>
                <span className="InventoryItemValue">{item.value}</span>
              </div>
              
            </div>
          )
        })}</div>
      )     
    } else {
      return (
        <div>No inventory</div>
      )
    }
  }
  
  render() {
    return (
      <div className="StoreInventory">
        {this.getInventoryItems()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    inventory: state.storeState.inventory
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setInventory: (newInventory) => dispatch({ type: SET_STORE_INVENTORY, inventory: newInventory })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreInventory);