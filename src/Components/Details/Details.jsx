import React from 'react';
import './Details.css';

// component imports
import DetailPCMenu from '../DetailPCMenu/DetailPCMenu';
import Adventurers from '../Adventurers/Adventurers';
import AdventurerDetail from '../AdventurerDetail/AdventurerDetail';

// redux imports
import { connect } from 'react-redux';
import { SET_DETAIL_UPDATE } from '../../actions/types';

import menuTypes from '../../Utilities/pcMenus';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadFormTable = this.loadFormTable.bind(this);
    this.getDetail = this.getDetail.bind(this);
  }

  formTable = {};

  componentDidMount() {
    this.loadFormTable();
    this.setState({ initialized: true });
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
    this.formTable[menuTypes.adventurer] = <AdventurerDetail />;
  }

  getDetail() {
    if (!this.state.initialized) return '';
    if (this.props.detailUpdate) {
      this.props.setDetailUpdate(false);
      return '';
    }
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
      <div className="Details primary-dark">
        <DetailPCMenu />
        {this.getDetail()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    pcDetailMenu: state.pcMenu.detail,
    detailUpdate: state.detail.update
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDetailUpdate: (value) => dispatch({ type: SET_DETAIL_UPDATE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);