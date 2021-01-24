import React from 'react';
import './Adventurers.css';

// component imports
import Adventurer from '../Adventurer/Adventurer';

// redux imports
import { connect } from 'react-redux';

class Adventurers extends React.Component {
  render() {
    if (!this.props.adventurers) return '';
    const adventurers = this.props.adventurers;
    return (
      <div className="adventurers">
        {adventurers.map(adventurer => {
          return <Adventurer adventurer={adventurer} />
        })}
        <div className="spacer-vertical"></div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    adventurers: state.adventurers.adventurers
  }
}

export default connect(mapStateToProps)(Adventurers);