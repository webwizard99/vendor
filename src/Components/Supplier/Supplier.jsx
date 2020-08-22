import React from 'react';
import './Supplier.css';

class Supplier extends React.Component {
  render() {
    return (
      <div className="Supplier">
        <div className="SupplierName">
          {this.props.supplierName}
        </div>
      </div>
    )
  }
}

export default Supplier;