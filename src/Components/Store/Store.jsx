import React from 'react';
import './Store.css';

// import game modules
// import gameStore from '../../game_modules/store';
import gameInventory from '../../game_modules/storeInventory';


// import components
import ItemTypes from '../../Utilities/itemTypes';
import StoreInventory from '../StoreInventory/StoreInventory';


// redux imports
import { SET_STORE_GOLD,
  SET_STORE_FILTER, 
  SET_STORE_FILTER_ACTIVE,
  SET_STORE_UPDATE_STATUS } from '../../actions/types';
import { fetchGold } from '../../actions';
import { connect } from 'react-redux';


class Store extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.getFilter = this.getFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.getIncrementButtons = this.getIncrementButtons.bind(this);
    this.handleIncrease = this.handleIncrease.bind(this);
    this.handleDecrease = this.handleDecrease.bind(this);
  }

  // ~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*
  // ~~*~~*~*~~* lifecycle methods ~~*~~*~*~~*~
  // ~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*~~*~~*~*
  
  componentDidMount() {
    this.props.fetchGold();
  }

  componentDidUpdate() {
    if (this.props.storeNeedsUpdate) {
      this.props.setStoreUpdateStatus(false);
    }
  }

  handleFilter(e) {
    let currentType = e.target.value;
    this.props.setStoreFilter(currentType);
  }

  handleIncrease() {
    console.log('handle increase');
    const payload = {
      filter: this.props.storeFilter,
      markup: 50
    }
    gameInventory.markupFilteredStoreItems(payload);
    gameInventory.updateStoreInventory();
    this.props.setStoreUpdateStatus(true);
  }

  handleDecrease() {
    console.log('handle decrease');
    const payload = {
      filter: this.props.storeFilter,
      markup: -50
    }
    gameInventory.markupFilteredStoreItems(payload);
    gameInventory.updateStoreInventory();
    this.props.setStoreUpdateStatus(true);
  }

  getIncrementButtons() {
    if (!this.props.filterActive) return '';
    return (
      <div className="incrementButtons">
        <div className="decreaseAll incrementButton button">
          <span className="incrementIcon">-</span>
        </div>
        <div className="increaseAll incrementButton button">
          <span className="incrementIcon">+</span>
        </div>
      </div>
    )
  }

  getFilter() {
    if (!this.props.filterActive) return '';
    const itemTypesArr = Object.values(ItemTypes);
    return (
      <select className="StoreItemTypeFilter" 
        defaultValue={this.props.storeFilter}
        onChange={this.handleFilter}>
        <option value="all">all</option>
        {itemTypesArr.map(itemType => {
          return (
            <option value={itemType}>{itemType}</option>
          )
        })}
      </select>
    )
  }

  toggleFilter() {
    const newValue = !this.props.filterActive;
    this.props.setStoreFilterActive(newValue);
  }
  
  render() {
    return (
      <div className="Store">
        <div className="StoreMenuBar">
          <h2 className="StoreName">{this.props.storeName}</h2>
          <div className="FilterGroup">
            {this.getIncrementButtons()}
            {this.getFilter()}
          </div>
          <span className="Inspect" role="img" aria-label="inspect" onClick={this.toggleFilter}>&#128269; </span>
          <div className="GoldDisplay">
            
            <div className="StoreGold"><span className="CoinSymbol" role="img" aria-label="coin">&#x2689; </span>{this.props.gold}</div>
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
    gold: state.storeState.gold,
    filterActive: state.storeState.filterActive,
    storeFilter: state.storeState.filter,
    storeNeedsUpdate: state.storeState.needsUpdate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStoreGold: (newGold) => dispatch({ type: SET_STORE_GOLD, amount: newGold }),
    fetchGold: () => dispatch(fetchGold()),
    setStoreFilter: (filter) => dispatch({ type: SET_STORE_FILTER, filter: filter }),
    setStoreFilterActive: (value) => dispatch({ type: SET_STORE_FILTER_ACTIVE, value: value }),
    setStoreUpdateStatus: (value) => dispatch({ type: SET_STORE_UPDATE_STATUS, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);