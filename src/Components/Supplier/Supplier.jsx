import React from 'react';
import './Supplier.css';

import SupplierBuyButton from '../SupplierBuyButton/SupplierBuyButton';

// game module imports
import gameItems from '../../game_modules/items';
import gameSuppliers from '../../game_modules/suppliers'
import gameStore from '../../game_modules/store';
import gameStoreInventory from '../../game_modules/storeInventory';

// redux imports
import { connect } from 'react-redux';
import { SET_DETAIL_UPDATE } from '../../actions/types';


class Supplier extends React.Component {
  constructor(props) {
    super(props);

    this.getSuppllierInventory = this.getSuppllierInventory.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
  }

  handlePurchase(payload) {
    const { ids, price } = payload;

    if (price > this.props.storeGold) {
      return;
    }

    // sell first item of object
    const sellId = ids[0];
    const sellPayload = {
      id: this.props.supplier.id,
      itemId: sellId,
      price: price
    }
    let sellRes = gameSuppliers.sellItem(sellPayload);
    if (!sellRes) {
      return;
    }

    // transact sale for vendor
    gameStore.chargeGold(price);
    gameStoreInventory.addItem(sellId);

    // update state
    gameStore.updateGold();
    gameStoreInventory.updateStoreInventory();
    gameSuppliers.updateSuppliers();

  }

  getSuppllierInventory() {
    if (!this.props.initialized) {
      return ''
    }
    // get details on items from ids
    let thisInventory = [];
    this.props.supplier.inventory.forEach(id => {
      let inventoryItem = gameItems.getItem(id);
      thisInventory.push(inventoryItem);
    });

    // organize all items by item name
    let inventoryGroups = {};
    let valueGroups = {}
    let typeGroups = {}
    let idGroups = {}
    thisInventory.forEach(item => {
      if (!inventoryGroups[item.name]) {
        inventoryGroups[item.name] = 1;
        valueGroups[item.name] = item.value;
        typeGroups[item.name] = item.type;
        idGroups[item.name] = [item.id]
      } else {
        inventoryGroups[item.name] += 1;
        idGroups[item.name].push(item.id);
      }
    });

    // create array of composed items
    let composedItems = []
    for (const [key, value] of Object.entries(inventoryGroups)) {
      let item = { name: key, count: value, type: typeGroups[key], value: valueGroups[key], ids: idGroups[key] };
      composedItems.push(item);
    }

    composedItems.sort((item1, item2) => {
      const nameA = item1.name.toUpperCase();
      const nameB = item2.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    return composedItems.map(item => {
      const offerings = this.props.supplier.offerings;
      const typeIndex = offerings.findIndex(offering => offering.type === item.type);
      
      let composedValue = item.value;
      if (typeIndex !== -1) {
        composedValue = composedValue * (1 + (offerings[typeIndex].markup / 1000));
        composedValue = Math.floor(composedValue);
      }

      return (
        <div className="SupplierInventoryItem itemBackground" key={item.id}>
          <span className="SupplierInventoryItemName">{item.name} ({item.count})</span>
          <div className="SupplierItemsValueGroup">  
            <span className="CoinSymbol">&#x2689; </span>
            <span className="InventoryItemValue">{composedValue}</span>
          </div>
          <div className="BuyButtonContainer" onClick={() => this.handlePurchase({ ids: item.ids, price: composedValue })}>
              <SupplierBuyButton />
            </div>
        </div>
      )
    })
  }

  render() {
    if (this.props.detailUpdate) {
      this.props.setDetailUpdate(false);
      return '';
    }
    let supplierClass = "Supplier primary";
    if (this.props.isMobile) {
      supplierClass += " mobileSupplier";
    }
    return (
      <div className={supplierClass}>
        <div className="SupplierName">
          {this.props.supplier.name}
          <div className="SupplierValueGroup">  
            <span className="CoinSymbol">&#x2689; </span>
            <span className="InventoryItemValue">{this.props.supplier.gold}</span>
          </div>
        </div>
        <div className="supplierInventory primary-light">
          {this.getSuppllierInventory()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    supplyReady: state.supplies.ready,
    storeGold: state.storeState.gold,
    isMobile: state.app.isMobile,
    detailUpdate: state.detail.update
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDetailUpdate: (value) => dispatch({ type: SET_DETAIL_UPDATE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Supplier);