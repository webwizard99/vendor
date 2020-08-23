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


class Supplier extends React.Component {
  constructor(props) {
    super(props);

    this.getSuppllierInventory = this.getSuppllierInventory.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
  }

  handlePurchase(payload) {
    console.log('in handlePurchase');
    console.dir(payload);
    console.log(`gold: ${this.props.storeGold}`);
    const { ids, price } = payload;

    if (price > this.props.storeGold) {
      return;
    }

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

    console.log('item sold by supplier');

    gameStore.chargeGold(price);
    gameStoreInventory.addItem(sellId);

    console.log('item bought by vendor');
    
    // update state
    gameStore.updateGold();
    gameStoreInventory.updateStoreInventory();
    gameSuppliers.updateSuppliers();

  }

  getSuppllierInventory() {
    if (!this.props.initialized) {
      return ''
    }
    let thisInventory = [];
    this.props.supplier.inventory.forEach(id => {
      let inventoryItem = gameItems.getItem(id);
      thisInventory.push(inventoryItem);
    });

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

    let composedItems = []

    for (const [key, value] of Object.entries(inventoryGroups)) {
      let item = { name: key, count: value, type: typeGroups[key], value: valueGroups[key], ids: idGroups[key] };
      composedItems.push(item);
    }

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
          <span className="SupplierInventoryItemName">{item.name}</span>
          <span className="ItemCount"> ({item.count})</span>
          <div className="SupplierItemsValueGroup">  
            <span className="CoinSymbol">&#x2689; </span>
            <span className="InventoryItemValue">{composedValue}</span>
            <div className="BuyButtonContainer" onClick={() => this.handlePurchase({ ids: item.ids, price: composedValue })}>
              <SupplierBuyButton />
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="Supplier">
        <div className="SupplierName">
          {this.props.supplier.name}
          <div className="SupplierValueGroup">  
            <span className="CoinSymbol">&#x2689; </span>
            <span className="InventoryItemValue">{this.props.supplier.gold}</span>
          </div>
        </div>
        <div className="supplierInventory">
          {this.getSuppllierInventory()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    supplyReady: state.supplies.ready,
    storeGold: state.storeState.gold
  }
}

export default connect(mapStateToProps)(Supplier);