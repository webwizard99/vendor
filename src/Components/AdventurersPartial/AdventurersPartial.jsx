import React from 'react';
import './AdventurersPartial.css';

import Adventurer from '../Adventurer/Adventurer';

// redux imports
import { connect } from 'react-redux';

class AdventurersPartial extends React.Component {
  constructor(props) {
    super(props);

    this.getAdventurers = this.getAdventurers.bind(this);
  }

  getAdventurers(adventurers) {
    return adventurers.map(adventurer => {
      return <Adventurer adventurer={adventurer} />
    });
  }


  render() {
    if (!this.props.adventurers || !this.props.partialAdventurers) return '';
    let partialAdventurers = this.props.partialAdventurers;
    let adventurers = this.props.adventurers;
    partialAdventurers = partialAdventurers.map(adventurerId => {
      return adventurers.find(adventurer => adventurer.id === adventurerId);
    })
    
    return (
      <div className="adventurers">
        {this.getAdventurers(partialAdventurers)}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    partialAdventurers: state.adventurers.partialAdventurers,
    adventurers: state.adventurers.adventurers
  }
}

export default connect(mapStateToProps)(AdventurersPartial);