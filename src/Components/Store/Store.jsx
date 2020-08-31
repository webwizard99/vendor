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

    this.state = {
      markup: 50
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

  increaseMarkup() {
    this.setState({ 
      markup: this.state.markup + this.markupIntensity
    });
  }

  onMouseDown(e) {
    const refBtn = e.target;
    console.log(refBtn);
    if (refBtn.classList.contains("decreaseAll") ||
      refBtn.classList.contains("minus")) {
      this.valence = -1;
    }
    if (refBtn.classList.contains("increaseAll" ||
      refBtn.classList.contains("plus"))) {
      this.valence = 1;
    }
    this.repeat();
  }

  repeat() {
    this.increaseMarkup();
    if (this.valence === -1) {
      this.handleDecrease();
    }
    if (this.valence === 1) {
      this.handleIncrease();
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
      markup: 50
    });
  }

  handleIncrease() {
    const payload = {
      filter: this.props.storeFilter,
      markup: this.state.markup
    }
    gameInventory.markupFilteredStoreItems(payload);
    gameInventory.updateStoreInventory();
    this.props.toggleStoreUpdateStatus();
  }

  handleDecrease() {
    const payload = {
      filter: this.props.storeFilter,
      markup: (this.state.markup * -1)
    }
    gameInventory.markupFilteredStoreItems(payload);
    gameInventory.updateStoreInventory();
    this.props.toggleStoreUpdateStatus();
  }

  getIncrementButtons() {
    if (!this.props.filterActive) return '';
    return (
      <div className="incrementButtons">
        <div className="decreaseAll incrementButton button"
          onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
          <span className="incrementIcon minus">-</span>
        </div>
        <div className="increaseAll incrementButton button"
          onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
          <span className="incrementIcon plus">+</span>
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
    toggleStoreUpdateStatus: () => dispatch({ type: SET_STORE_UPDATE_STATUS })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);