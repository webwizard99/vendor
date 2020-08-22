import React from 'react';
import './Suppliers.css';
import Supplier from '../Supplier/Supplier';

// redux imports
import { connect } from 'react-redux';

// game imports
import gameSupplier from '../../game_modules/suppliers';

class Suppliers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suppliersInitialized: false
    }

    this.getSuppliers = this.getSuppliers.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate() {
    if (Array.isArray(this.props.suppliers && this.props.supplyReady)) {
      if (!this.state.suppliersInitialized) {
        gameSupplier.takeSupplierTurn();
        this.setState({
          suppliersInitialized: true
        })
      }
    }
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
    suppliers: state.suppliers.suppliers,
    supplyReady: state.supplies.ready
  }
}

export default connect(mapStateToProps)(Suppliers);