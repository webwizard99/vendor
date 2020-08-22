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
    const currentSuppliers = this.props.suppliers;
    if (!currentSuppliers) return '';
    return currentSuppliers.map(supplier => {
      return <Supplier supplierName={supplier.name} />
    });
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