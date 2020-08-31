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
      suppliersInitialized: false,
      overflow: false
    }

    this.getSuppliers = this.getSuppliers.bind(this);
    this.getSuppliersControlLayer = this.getSuppliersControlLayer.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.checkForOverflow = this.checkForOverflow.bind(this);
    this.handleScrollLeft = this.handleScrollLeft.bind(this);
    this.handleScrollRight = this.handleScrollRight.bind(this);
  }

  componentDidMount() {
    this.checkForOverflow();
  }

  handleScrollLeft() {
    const suppliersContainer = document.querySelector('suppliersContainer');
    if (suppliersContainer) {
      console.log(suppliersContainer);
    }
  }

  handleScrollRight() {
    const suppliersContainer = document.querySelector('suppliersContainer');
    if (suppliersContainer) {
      console.log(suppliersContainer);
    }
  }

  checkForOverflow() {
    const { scrollWidth, clientWidth } = this.container;
    console.dir(this.container);
    const hasOverflow = scrollWidth > clientWidth;
    console.log(`scrollwidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
    this.setState({ overflow: hasOverflow });
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

  getSuppliersControlLayer() {
    if (this.state.overflow) {
      return (
        <div className="SuppliersControlLayer">
        <div className="SupplierIcon">&lt</div>
        <div className="SupplierIcon">&gt</div>
      </div>
      )
    } else {
      return ''
    }
  }
  
  render() {
    return (
      <div className="Suppliers">
        {this.getSuppliers()}
        {this.getSuppliersControlLayer()}
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