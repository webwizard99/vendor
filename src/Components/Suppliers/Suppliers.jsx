import React from 'react';
import './Suppliers.css';
import Supplier from '../Supplier/Supplier';

// redux imports
import { connect } from 'react-redux';
import { SET_SUPPLIERS_INITIALIZED } from '../../actions/types';

// game imports
import gameSupplier from '../../game_modules/suppliers';
import gameSupplies from '../../game_modules/supplies';
// import suppliers from '../../game_modules/suppliers';

class Suppliers extends React.Component {
  constructor(props) {
    super(props);

    this.getSuppliers = this.getSuppliers.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateSuppliers = this.updateSuppliers.bind(this);
  }

  updateSuppliers() {
    if (Array.isArray(this.props.suppliers) && this.props.supplySpawned) {
      if (!this.props.supplyReady) {
        gameSupplies.fillSupplies();
      }
    }
    if (Array.isArray(this.props.suppliers) && this.props.supplyReady) {
      if (!this.props.suppliersInitialized) {
        gameSupplier.takeSupplierTurn();
        this.props.setSuppliersInitialized(true);
      }
    }
  }

  componentDidMount() {
    this.updateSuppliers();
  }

  componentDidUpdate() {
    this.updateSuppliers();
  }

  getSuppliers() {
    if (this.props.detailUpdate) {
      return '';
    }
    let supplierContainerClass = "suppliersContainer";
    let spacerClass = "spacer";
    if (!this.props.isPc) {
      supplierContainerClass += " nonPcContainer";
      supplierContainerClass += " mobileContainer";
      spacerClass += " mobileSpacer";
    }
    let currentSuppliers = this.props.suppliers;
    if (Array.isArray(currentSuppliers)) {
      const suppliersDisplay = currentSuppliers.map(renderSupplier => {
        return (<Supplier supplier={renderSupplier} initialized={this.props.suppliersInitialized}/>);
      });

      return (
        <div className={supplierContainerClass}
          ref={node => {
            this.container = node;
          }}>
          {suppliersDisplay}
          <div className={spacerClass}></div>
        </div>
      );
    } else {
      return 'no suppliers to render';
    }
    
  }
  
  render() {
    let suppliersClass = "Suppliers primary-dark";
    if (!this.props.isPc) {
      suppliersClass += " mobileSuppliers";
    }
    return (
      <div className={suppliersClass}>
        {this.getSuppliers()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    suppliers: state.suppliers.suppliers,
    supplyReady: state.supplies.ready,
    supplySpawned: state.supplies.spawned,
    isPc: state.app.isPc,
    isMobile: state.app.isMobile,
    suppliersInitialized: state.suppliers.initialized,
    detailUpdate: state.detail.update
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSuppliersInitialized: (value) => dispatch({ type: SET_SUPPLIERS_INITIALIZED, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Suppliers);