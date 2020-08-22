import React from 'react';
import './Suppliers.css';
import Supplier from '../Supplier/Supplier';

// redux imports
import { connect } from 'react-redux';

class Suppliers extends React.Component {
  constructor(props) {
    super(props);

    this.getSuppliers = this.getSuppliers.bind(this);
  }

  getSuppliers() {
    
    
    let currentSuppliers = this.props.suppliers;
    
    if (Array.isArray(currentSuppliers)) {
      console.log(currentSuppliers);
      const suppliersDisplay = currentSuppliers.map(renderSupplier => {
        return (<Supplier supplier={renderSupplier} />);
      });

      return (
        <div className="suppliersContainer">
          {suppliersDisplay}
        </div>
      );
    } else {
      return 'no suppliers to render';
    }
    
  }
  
  render() {
    return (
      <div className="Suppliers">
        {this.getSuppliers()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    suppliers: state.suppliers.suppliers
  }
}

export default connect(mapStateToProps)(Suppliers);