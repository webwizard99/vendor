import React from 'react';
import './Suppliers.css';
import Supplier from '../Supplier/Supplier';

// redux imports
import { connect } from 'react-redux';
import { fetchSuppliers } from '../../actions';

class Suppliers extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getSuppliers = this.getSuppliers.bind(this);
  }

  componentDidMount() {
    console.log('in Suppliers component lifecycle method');
    this.props.fetchSuppliers();
  }

  getSuppliers() {
    
    
    let currentSuppliers = this.props.suppliers;
    console.log(currentSuppliers);
    console.log(currentSuppliers.length);
    console.log(Array.isArray(currentSuppliers));
    
    if (Array.isArray(currentSuppliers)) {
      console.log(currentSuppliers.length);
      
      const suppliersDisplay = currentSuppliers.map(renderSupplier => {
        return (<Supplier supplierName={renderSupplier.name} />);
      });
      console.log(suppliersDisplay);

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
    suppliersCount: state.suppliers.count
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSuppliers: () => dispatch(fetchSuppliers())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Suppliers);