import React from 'react';
import './MobileStoreHeadbar.css';

// redux imports
import { connect } from 'react-redux';

class MobileStoreHeadbar extends React.Component {
  render() {
    return (
      <div className="MobileStoreHeadbar">
        <h2 className="StoreName">{this.props.storeName}</h2>
        <div className="GoldDisplay">
            <div className="StoreGold"><span className="CoinSymbol" role="img" aria-label="coin">&#x2689; </span>{this.props.gold}</div>
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    storeName: state.storeState.name,
    gold: state.storeState.gold,
  }
}

export default connect(mapStateToProps)(MobileStoreHeadbar);