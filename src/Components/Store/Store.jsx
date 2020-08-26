import React from 'react';
import './Store.css';

// import gameStore from '../../Utilities/store';

import ItemTypes from '../../Utilities/itemTypes';
import StoreInventory from '../StoreInventory/StoreInventory';

import { SET_STORE_GOLD, SET_STORE_FILTER, SET_STORE_FILTER_ACTIVE } from '../../actions/types';
import { fetchGold } from '../../actions';
import { connect } from 'react-redux';

class Store extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
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

  handleFilter(e) {
    let currentType = e.target.value;
    this.props.setStoreFilter(currentType);
  }

  handleIncrease() {
    console.log('handle increase');
  }

  handleDecrease() {
    console.log('handle decrease');
  }

  getIncrementButtons() {
    if (!this.props.filterActive) return '';
    return (
      <div className="incrementButtons">
        <div className="increaseAll incrementButton button">
          +
        </div>
        <div className="decreaseAll incrementButton button">
          -
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
    storeFilter: state.storeState.filter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStoreGold: (newGold) => dispatch({ type: SET_STORE_GOLD, amount: newGold }),
    fetchGold: () => dispatch(fetchGold()),
    setStoreFilter: (filter) => dispatch({ type: SET_STORE_FILTER, filter: filter }),
    setStoreFilterActive: (value) => dispatch({ type: SET_STORE_FILTER_ACTIVE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);