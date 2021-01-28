import React from 'react';
import './MobileGameScreen.css';

import Store from '../../Components/Store/Store';
import MobileStoreHeadbar from '../../Components/MobileStoreHeadbar/MobileStoreHeadbar';
import Suppliers from '../../Components/Suppliers/Suppliers';
import MobileMenu from '../../Components/MobileMenu/MobileMenu';
import Adventurers from '../../Components/Adventurers/Adventurers';
import AdventurerDetail from '../../Components/AdventurerDetail/AdventurerDetail';

// redux imports
import { connect } from 'react-redux';

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
  }

  getCurrentScreen() {
    if (!this.state.initialized) return '';
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
      <div className="MobileGameScreen">
        <MobileMenu />
        {this.getCurrentScreen()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mobileScreen: state.mobileMenu.screen
  }
}

export default connect(mapStateToProps)(MobileGameScreen);