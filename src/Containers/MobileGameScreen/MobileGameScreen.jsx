import React from 'react';
import './MobileGameScreen.css';

import Store from '../../Components/Store/Store';
import MobileStoreHeadbar from '../../Components/MobileStoreHeadbar/MobileStoreHeadbar';
import Suppliers from '../../Components/Suppliers/Suppliers';
import MobileMenu from '../../Components/MobileMenu/MobileMenu';
import Adventurers from '../../Components/Adventurers/Adventurers';
import AdventurerDetail from '../../Components/AdventurerDetail/AdventurerDetail';
import AdventurersPartial from '../../Components/AdventurersPartial/AdventurersPartial';
import Dungeon from '../../Components/Dungeon/Dungeon';

// redux imports
import { connect } from 'react-redux';
import { SET_DETAIL_UPDATE } from '../../actions/types';

// utility imports
import mobileScreens from '../../Utilities/mobileScreens';

class MobileGameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'store',
      initialized: false
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadFormTable = this.loadFormTable.bind(this);
  }

  formTable = {};

  componentDidMount() {
    this.loadFormTable();
    this.setState({ initialized: true });
  }

  loadFormTable() {
    const allScreens = mobileScreens.getAllScreens();
    const forms = Object.values(allScreens);
    let tempTable = {};
    for (let form of forms) {
      tempTable[form] = null;
    }
    this.formTable = tempTable;
    this.formTable['blank'] = (<div className="BlankForm">detail type unknown</div>);
    this.formTable[allScreens.store] = <Store />;
    this.formTable[allScreens.suppliers] = (
      <div>
        <MobileStoreHeadbar />
        <Suppliers />
      </div>
    );
    this.formTable[allScreens.adventurers] = <Adventurers />;
    this.formTable[allScreens.adventurer] = <AdventurerDetail />;
    this.formTable[allScreens.dungeon] = <Dungeon />;
    this.formTable[allScreens.adventurersPartial] = <AdventurersPartial />;
  }

  getCurrentScreen() {
    if (!this.state.initialized) return '';
    if (this.props.detailUpdate) {
      this.props.setDetailUpdate(false);
      return '';
    }
    if (!this.props.mobileScreen) {
      return (<div className="BlankForm">no details to display</div>)
    }

    if (this.formTable[this.props.mobileScreen] === undefined) {
      return this.formTable['blank'];
    }
    return this.formTable[this.props.mobileScreen];
  }
  
  render() {
    return (
      <div className="MobileGameScreen primary-dark">
        <MobileMenu />
        {this.getCurrentScreen()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mobileScreen: state.mobileMenu.screen,
    detailUpdate: state.detail.update
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDetailUpdate: (value) => dispatch({ type: SET_DETAIL_UPDATE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileGameScreen);