import React from 'react';
import './Suppliers.css';
import Supplier from '../Supplier/Supplier';

// redux imports
import { connect } from 'react-redux';
import { SET_SUPPLIERS_INITIALIZED } from '../../actions/types';

// game imports
import gameSupplier from '../../game_modules/suppliers';
import gameSupplies from '../../game_modules/supplies';

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
    let styleAdjust = {};
    if (this.props.isMobile) {
      styleAdjust.flexDirection = 'column'
      styleAdjust.height = '100%';
    }
    let currentSuppliers = this.props.suppliers;    
    if (Array.isArray(currentSuppliers)) {
      const suppliersDisplay = currentSuppliers.map(renderSupplier => {
        return (<Supplier supplier={renderSupplier} initialized={this.props.suppliersInitialized}/>);
      });

      return (
        <div className="suppliersContainer"
          style={styleAdjust}
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
    let suppliersClass = "Suppliers";
    if (this.props.isMobile) {
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
    isMobile: state.app.isMobile,
    suppliersInitialized: state.suppliers.initialized
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSuppliersInitialized: (value) => dispatch({ type: SET_SUPPLIERS_INITIALIZED, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Suppliers);