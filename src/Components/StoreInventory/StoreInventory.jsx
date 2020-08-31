import React from 'react';
import './StoreInventory.css';

import { connect } from 'react-redux';
import { SET_STORE_INVENTORY, SET_STORE_UPDATE_STATUS } from '../../actions/types';

import gameInventory from '../../game_modules/storeInventory';
// import storeItems from '../../game_modules/items';

class StoreInventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      markup: 50,
      id: null
    }
    this.timer = undefined;
    this.delay = 200;
    this.markupIntensity = 10;
    this.valence = 1;
    this.increaseMarkup = this.increaseMarkup.bind(this);
    this.repeat = this.repeat.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.markupOut = this.markupOut.bind(this);
    
    this.handleOneIncrement = this.handleOneIncrement.bind(this);
    this.getInventoryItems = this.getInventoryItems.bind(this);
    this.getIncrementOneButtons = this.getIncrementOneButtons.bind(this);
  }

  componentDidMount() {
    const newInventory = JSON.parse(JSON.stringify(gameInventory.getStoreInventory()));
    this.props.setInventory(newInventory);
  }

  increaseMarkup() {
    this.setState({
      markup: this.state.markup + this.markupIntensity
    });
  }

  onMouseDown(payload) {
    const { e } = payload;
    let id = null, prototypeId = null;
    if (payload.id !== null) {
      id = payload.id;
      this.setState({ id: id });
    }
    if (payload.prototypeId !== null) {
      prototypeId = payload.prototypeId;
    }
    const refBtnClasses = e.target.classList;
    if (refBtnClasses.contains("decreaseOne") ||
      refBtnClasses.contains("minusOne")) {
        this.valence = -1;
    }
    if (refBtnClasses.contains("increaseOne") ||
      refBtnClasses.contains("plusOne")) {
        this.valence = 1;
    }
    this.repeat();
  }

  repeat() {
    this.increaseMarkup();
    if (this.state.id !== null) {
      this.handleOneIncrement();
    }
    this.timer = setTimeout(this.repeat, this.delay);
    this.markupIntensity += 5;
  }

  onMouseUp() {
    clearTimeout(this.timer);
    this.markupIntensity = 50;
    this.valence = 1;
    this.markupOut();
  }

  markupOut() {
    this.setState({
      markup: 50,
      id: null
    });
  }

  handleOneIncrement() {
    const id = this.state.id;
    const posNeg = this.valence;
    const itemPayload = {
      id: id,
      markup: (this.state.markup * posNeg)
    }
    gameInventory.markupStoreItem(itemPayload);
    this.props.toggleStoreUpdateStatus();
  }

  getIncrementOneButtons(id) {
    return (
      <div className="incrementButtons incrementOneSet">
        <div className="decreaseOne incrementButton button"
          onMouseDown={(e) => this.handleMouseDown({ id: id, e: e })}
          onMouseUp={this.onMouseUp}>
          <span className="incrementIcon minusOne">-</span>
        </div>
        <div className="increaseOne incrementButton button"
          onMouseDown={(e) => this.handleOneIncrement({ id: id, e: e })}
          onMouseUp={this.onMouseUp}>
          <span className="incrementIcon plusOne">+</span>
        </div>
      </div>
    )
  }

  getInventoryItems() {
    if (this.props.inventory && this.props.inventory.length > 0) {
      let filteredInventory;
      if (!this.props.filterActive || this.props.storeFilter === 'all') {
        filteredInventory = gameInventory.getComposedInventory();
      } else {
        filteredInventory = gameInventory.getFilteredInventory(this.props.storeFilter);
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
    setInventory: (newInventory) => dispatch({ type: SET_STORE_INVENTORY, inventory: newInventory }),
    toggleStoreUpdateStatus: () => dispatch({ type: SET_STORE_UPDATE_STATUS })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreInventory);