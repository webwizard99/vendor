import React from 'react';
import './Adventurers.css';

// component imports
import Adventurer from '../Adventurer/Adventurer';

// redux imports
import { connect } from 'react-redux';

class Adventurers extends React.Component {
  constructor(props) {
    super(props);

    this.getAdventurers = this.getAdventurers.bind(this);
  }

  getAdventurers() {
    const adventurers = this.props.adventurers;
    return adventurers.map(adventurer => {
      return <Adventurer adventurer={adventurer} />
    });
  }
  
  render() {
    if (!this.props.adventurers) return '';
    return (
      <div className="adventurers">
        {this.getAdventurers()}
        <div className="spacer-vertical"></div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    adventurers: state.adventurers.adventurers,
    adventurerUpdate: state.adventurers.update
  }
}

export default connect(mapStateToProps)(Adventurers);