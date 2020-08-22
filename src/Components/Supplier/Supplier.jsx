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
    if (!this.props.supplier.inventory || !Array.isArray(this.props.supplier.inventory || this.props.supplier.inventory.length <=0)) {
      return ''
    }
    const thisInventory = this.props.supplier.inventory.map(id => {
      console.log(`mapping id(${id}) to items module`);
      return Items.getItem(id);
    });

    console.log(thisInventory);
    return thisInventory.map(item => {
      const offerings = this.props.supplier.offerings;
      const typeIndex = offerings.findIndex(offering => offering.type === item.type);
      console.log(typeIndex);
      return (
        <div className="InventoryItem" key={item.id}>
          <span className="InventoryItemName">{item.name}</span>
          <div className="ItemsValueGroup">
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