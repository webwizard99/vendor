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
    if (!this.props.initialized) {
      return ''
    }
    let thisInventory = [];
    this.props.supplier.inventory.forEach(id => {
      let inventoryItem = Items.getItem(id);
      thisInventory.push(inventoryItem);
    });

    let inventoryGroups = {};
    let valueGroups = {}
    let typeGroups = {}

    thisInventory.forEach(item => {
      if (!inventoryGroups[item.name]) {
        inventoryGroups[item.name] = 1;
        valueGroups[item.name] = item.value;
        typeGroups[item.name] = item.type;
      } else {
        inventoryGroups[item.name] += 1;
      }
    });

    let composedItems = []

    for (const [key, value] of Object.entries(inventoryGroups)) {
      let item = { name: key, count: value, type: typeGroups[key], value: valueGroups[key] };
      composedItems.push(item);
    }

    console.log(composedItems);
    return composedItems.map(item => {
      const offerings = this.props.supplier.offerings;
      const typeIndex = offerings.findIndex(offering => offering.type === item.type);
      
      let composedValue = item.value;
      if (typeIndex !== -1) {
        composedValue = composedValue *= offerings[typeIndex].markup;
      }

      return (
        <div className="SupplierInventoryItem itemBackground" key={item.id}>
          <span className="SupplierInventoryItemName">{item.name}</span>
          <span className="ItemCount"> X{item.count}</span>
          <div className="SupplierItemsValueGroup">  
            <span className="CoinSymbol">&#x2689; </span>
            <span className="InventoryItemValue">{composedValue}</span>
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