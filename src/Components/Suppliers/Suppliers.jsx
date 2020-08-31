import React from 'react';
import './Suppliers.css';
import Supplier from '../Supplier/Supplier';

// redux imports
import { connect } from 'react-redux';

// game imports
import gameSupplier from '../../game_modules/suppliers';
import gameSupplies from '../../game_modules/supplies';

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
    if (Array.isArray(this.props.suppliers) && this.props.supplySpawned) {
      if (!this.props.supplyReady) {
        gameSupplies.fillSupplies();
      }
    }
    if (Array.isArray(this.props.suppliers) && this.props.supplyReady) {
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
      const suppliersDisplay = currentSuppliers.map(renderSupplier => {
        return (<Supplier supplier={renderSupplier} initialized={this.state.suppliersInitialized}/>);
      });

      return (
        <div className="suppliersContainer"
          ref={node => {
            this.container = node;
          }}>
          {suppliersDisplay}
          <div className="spacer"></div>
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
    supplyReady: state.supplies.ready,
    supplySpawned: state.supplies.spawned
  }
}

export default connect(mapStateToProps)(Suppliers);