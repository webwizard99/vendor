import React from 'react';
import './StoreInventory.css';

// component imports
import Coin from '../Coin/Coin';

import { connect } from 'react-redux';
import { SET_STORE_INVENTORY,
  SET_STORE_UPDATE_STATUS,
  SET_STORE_MOBILE_DETAIL,
  SET_STORE_MOBILE_DETAIL_ITEM } from '../../actions/types';

import gameInventory from '../../game_modules/storeInventory';
// import storeItems from '../../game_modules/items';

class StoreInventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      markup: 50
    }
    this.timer = undefined;
    this.mobileMultiplier = 2;
    this.delay = 200;
    this.markupIntensity = 10;
    this.valence = 1;
    this.increaseMarkup = this.increaseMarkup.bind(this);
    this.repeat = this.repeat.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.markupOut = this.markupOut.bind(this);
    
    this.handleMobileFocus = this.handleMobileFocus.bind(this);
    this.handleOneIncrement = this.handleOneIncrement.bind(this);
    this.handlePrototypeIncrement = this.handlePrototypeIncrement.bind(this);
    this.getInventoryItems = this.getInventoryItems.bind(this);
    this.getIncrementOneButtons = this.getIncrementOneButtons.bind(this);
    this.getIncrementAllButtons = this.getIncrementAllButtons.bind(this);
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
    }
    if (payload.prototypeId !== null) {
      prototypeId = payload.prototypeId;
    }
    const refBtnClasses = e.target.classList;
    if (refBtnClasses.contains("decreaseOne") ||
      refBtnClasses.contains("minusOne") ||
      refBtnClasses.contains("decreaseProto") ||
      refBtnClasses.contains("minusProto")) {
        this.valence = -1;
    }
    if (refBtnClasses.contains("increaseOne") ||
      refBtnClasses.contains("plusOne") ||
      refBtnClasses.contains("increaseProto") ||
      refBtnClasses.contains("plusProto")) {
        this.valence = 1;
    }
    const repeatPayload = {
      id: id,
      prototypeId: prototypeId
    }
    this.repeat(repeatPayload);
  }

  repeat(payload) {
    let { id, prototypeId } = payload;
    const repeatPayload = {
      id: id,
      prototypeId: prototypeId
    }
    this.increaseMarkup();
    if (id !== undefined) {
      this.handleOneIncrement(id);
    }
    if (prototypeId !== undefined) {
      this.handlePrototypeIncrement(prototypeId);
    }
    let totaldelay = this.delay * this.mobileMultiplier;
    if (this.mobileMultiplier > 1) {
      this.mobileMultiplier = 1;
    }
    this.timer = setTimeout(() => this.repeat(repeatPayload), totaldelay);
    this.markupIntensity += 5;
  }

  onMouseUp() {
    clearTimeout(this.timer);
    this.markupIntensity = 10;
    this.valence = 1;
    this.mobileMultiplier = 2;
    this.markupOut();
  }

  markupOut() {
    this.setState({
      markup: 50
    });
  }

  handleOneIncrement(id) {
    const posNeg = this.valence;
    const itemPayload = {
      id: id,
      markup: (this.state.markup * posNeg)
    }
    gameInventory.markupStoreItem(itemPayload);
    this.props.toggleStoreUpdateStatus();
  }

  handlePrototypeIncrement(prototypeId) {
    const posNeg = this.valence;
    const itemsPayload = {
      prototypeId: prototypeId,
      markup: (this.state.markup * posNeg)
    }
    gameInventory.markupPrototypes(itemsPayload);
    this.props.toggleStoreUpdateStatus();
  }

  getIncrementOneButtons(id) {
    if (this.props.isPc) {
      return (
        <div className="incrementButtons incrementOneSet">
          <div className="decreaseOne incrementButton button secondary"
            onMouseDown={(e) => this.onMouseDown({ id: id, e: e })}
            onMouseUp={this.onMouseUp}>
            <span className="incrementIcon minusOne">-</span>
          </div>
          <div className="increaseOne incrementButton button secondary"
            onMouseDown={(e) => this.onMouseDown({ id: id, e: e })}
            onMouseUp={this.onMouseUp}>
            <span className="incrementIcon plusOne">+</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="incrementButtons incrementOneSet">
          <div className="decreaseOne incrementButton button secondary"
            onTouchStart={(e) => this.onMouseDown({ id: id, e: e })}
            onTouchEnd={this.onMouseUp}>
            <span className="incrementIcon minusOne">-</span>
          </div>
          <div className="increaseOne incrementButton button secondary"
            onTouchStart={(e) => this.onMouseDown({ id: id, e: e })}
            onTouchEnd={this.onMouseUp}>
            <span className="incrementIcon plusOne">+</span>
          </div>
        </div>
      )
    }
    
  }

  getIncrementAllButtons(prototypeId) {
    if (this.props.isPc) {
      return (
        <div className="incrementButtons incrementAllSet">
          <div className="decreaseProto incrementButtonWide button secondary"
            onMouseDown={(e) => this.onMouseDown({ prototypeId: prototypeId, e: e })}
            onMouseUp={this.onMouseUp}>
            <span className="incrementIcon minusProto">--</span>
          </div>
          <div className="increaseProto incrementButtonWide button secondary"
            onMouseDown={(e) => this.onMouseDown({ prototypeId: prototypeId, e: e })}
            onMouseUp={this.onMouseUp}>
            <span className="incrementIcon plusProto">++</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="incrementButtons incrementAllSet">
          <div className="decreaseProto incrementButtonWide button secondary"
            onTouchStart={(e) => this.onMouseDown({ prototypeId: prototypeId, e: e })}
            onTouchEnd={this.onMouseUp}>
            <span className="incrementIcon minusProto">--</span>
          </div>
          <div className="increaseProto incrementButtonWide button secondary"
            onTouchStart={(e) => this.onMouseDown({ prototypeId: prototypeId, e: e })}
            onTouchEnd={this.onMouseUp}>
            <span className="incrementIcon plusProto">++</span>
          </div>
        </div>
      )
    }
    
  }

  handleMobileFocus(item) {
    let mobileItem;
    if (this.props.mobileItemDetail) {
      mobileItem = this.props.mobileItemDetail;
    }
    if (this.props.mobileItemDetail && this.props.mobileDetail && mobileItem.id === item.id) {
      this.props.setStoreMobileDetail(false);
      this.props.setStoreMobileDetailItem(null);
      window.inventory = undefined;
    } else {
      this.props.setStoreMobileDetail(true);
      this.props.setStoreMobileDetailItem(item);
      window.inventory = this;
    }
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
          let itemClass = "InventoryItem itemBackground";
          if (this.props.mobileDetail && item.id === this.props.mobileItemDetail.id) {
            itemClass += " activeMobileItem";
          }
          return (
            <div className={itemClass} 
              key={item.id}
              onTouchStart={() => this.handleMobileFocus(item)}>
              <span className="InventoryItemName">{item.name}</span>
              {this.props.isPc ? this.getIncrementOneButtons(item.id) : ''}
              {this.props.isPc ? this.getIncrementAllButtons(item.prototypeId) : ''}
              <div className="ItemValueGroup">
                <span className="InventoryItemValue"><span className="CoinSymbol"><Coin /> </span>{composedPrice}</span>
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
      <div className="StoreInventory primary">
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
    storeNeedsUpdate: state.storeState.needsUpdate,
    isMobile: state.app.isMobile,
    isPc: state.app.isPc,
    mobileDetail: state.storeState.mobileDetail,
    mobileItemDetail: state.storeState.mobileItemDetail
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setInventory: (newInventory) => dispatch({ type: SET_STORE_INVENTORY, inventory: newInventory }),
    toggleStoreUpdateStatus: () => dispatch({ type: SET_STORE_UPDATE_STATUS }),
    setStoreMobileDetail: (detail) => dispatch({ type: SET_STORE_MOBILE_DETAIL, detail: detail }),
    setStoreMobileDetailItem: (itemDetail) => dispatch({ type: SET_STORE_MOBILE_DETAIL_ITEM, itemDetail: itemDetail })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreInventory);