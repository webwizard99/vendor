import React from 'react';
import './Details.css';

// component imports
import DetailPCMenu from '../DetailPCMenu/DetailPCMenu';
import Adventurers from '../Adventurers/Adventurers';

// redux imports
import { connect } from 'react-redux';

import menuTypes from '../../Utilities/pcMenus';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadFormTable = this.loadFormTable.bind(this);
    this.getDetail = this.getDetail.bind(this);
  }

  formTable = {};

  componentDidMount() {
    this.loadFormTable();
  }

  loadFormTable() {
    const forms = Object.values(menuTypes);
    let tempTable = {};
    for (let form of forms) {
      tempTable[form] = null;
    }
    this.formTable = tempTable;
    this.formTable['blank'] = (<div className="BlankForm">detail type unknown</div>);
    this.formTable[menuTypes.adventurers] = <Adventurers />;
  }

  getDetail() {
    if (!this.props.pcDetailMenu) {
      return (<div className="BlankForm">no details to display</div>);
    }

    if (this.formTable[this.props.pcDetailMenu] === undefined) {
      return this.formTable['blank'];
    }
    return this.formTable[this.props.pcDetailMenu];
  }
  
  render() {
    return (
      <div className="Details">
        <DetailPCMenu />
        {this.getDetail()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    pcDetailMenu: state.pcMenu.detail
  }
}

export default connect(mapStateToProps)(Details);