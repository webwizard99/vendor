import React from 'react';
import './StoreInventory.css';

import { connect } from 'react-redux';
import { SET_STORE_INVENTORY } from '../../actions/types';

import storeInventory from '../../game_modules/storeInventory';
// import storeItems from '../../game_modules/items';

class StoreInventory extends React.Component {
  constructor(props) {
    super(props);
    
    this.getInventoryItems = this.getInventoryItems.bind(this);
    this.getIncrementOneButtons = this.getIncrementOneButtons.bind(this);
    // this.incrementById = this.incrementById.bind(this);
  }

  componentDidMount() {
    const newInventory = JSON.parse(JSON.stringify(storeInventory.getStoreInventory()));
    this.props.setInventory(newInventory);
  }

  getIncrementOneButtons(id) {
    return (
      <div className="incrementButtons incrementOneSet">
        <div className="decreaseOne incrementButton button"
        >
          <span className="incrementIcon minusOne">-</span>
        </div>
        <div className="increaseOne incrementButton button"
        >
          <span className="incrementIcon plusOne">+</span>
        </div>
      </div>
    )
  }

  getInventoryItems() {
    if (this.props.inventory && this.props.inventory.length > 0) {
      let filteredInventory;
      if (!this.props.filterActive || this.props.storeFilter === 'all') {
        filteredInventory = storeInventory.getComposedInventory();
      } else {
        filteredInventory = storeInventory.getFilteredInventory(this.props.storeFilter);
      }
      return (
        <div>{filteredInventory.map(item => {
          const composedPrice = Math.floor(item.value * (1 + (item.markup / 1000)));
          return (
            <div className="InventoryItem itemBackground" key={item.id}>
              <span className="InventoryItemName">{item.name}</span>
              {this.getIncrementOneButtons(item.id)}
              <div className="ItemValueGroup">
                <span className="InventoryItemValue"><span className="CoinSymbol">&#x2689; </span>{composedPrice}</span>
              </div>
              
            </div>
          )
        })}</div>
      )     
    } else {
      return (
        <div></div>
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
    inventory: state.storeState.inventory,
    inventoryCount: state.storeState.inventoryCount,
    filterActive: state.storeState.filterActive,
    storeFilter: state.storeState.filter,
    storeNeedsUpdate: state.storeState.needsUpdate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setInventory: (newInventory) => dispatch({ type: SET_STORE_INVENTORY, inventory: newInventory })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreInventory);