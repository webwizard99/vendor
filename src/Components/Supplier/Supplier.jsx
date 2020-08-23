import React from 'react';
import './Supplier.css';

import Items from '../../game_modules/items';

// redux imports
import { connect } from 'react-redux';

class Supplier extends React.Component {
  constructor(props) {
    super(props);

    this.getSuppllierInventory = this.getSuppllierInventory.bind(this);
  }
  getSuppllierInventory() {
    console.log(this.props.supplier.inventory);
    console.log(this.props.initialized);
    if (!this.props.initialized) {
      return ''
    }
    let thisInventory = [];
    this.props.supplier.inventory.forEach(id => {
      console.log(`mapping id(${id}) to items module`);
      let inventoryItem = Items.getItem(id);
      thisInventory.push(inventoryItem);
    });

    let inventoryGroups = {};
    let valueGroups = {}

    thisInventory.forEach(item => {
      if (!inventoryGroups[item.name]) {
        inventoryGroups[item.name] = 1;
        valueGroups[item.name] = item.value;
      } else {
        inventoryGroups[item.name] += 1;
      }
    });

    let composedItems = []

    for (const [key, value] of Object.entries(inventoryGroups)) {
      let item = { name: key, count: value, value: valueGroups[key] };
      composedItems.push(item);
    }

    console.log(composedItems);
    return composedItems.map(item => {
      const offerings = this.props.supplier.offerings;
      const typeIndex = offerings.findIndex(offering => offering.type === item.type);
      console.log(typeIndex);

      return (
        <div className="SupplierInventoryItem itemBackground" key={item.id}>
          <span className="SupplierInventoryItemName">{item.name}</span>
          <div className="SupplierItemsValueGroup">
            <span className="ItemCount">(${item.count})</span>
            <span className="CoinSymbol">&#x2689; </span>
            <span className="InventoryItemValue">{item.value}</span>
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
    supplyReady: state.supplies.ready
  }
}

export default connect(mapStateToProps)(Supplier);