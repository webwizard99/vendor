import React from 'react';
import './Dungeon.css';

import DungeonLevel from '../DungeonLevel/DungeonLevel';

// redux imports
import { connect } from 'react-redux';

class Dungeon extends React.Component {
  constructor(props) {
    super(props);

    this.getLevels = this.getLevels.bind(this);
  }
  
  getLevels() {
    const levels = this.props.levels;
    console.log(levels);
    console.log(this.props.exploredLevel);
    const levelsToDisplay = levels.filter(level => level.number <= this.props.exploredLevel);
    console.log(levelsToDisplay);
    return levelsToDisplay.map(level => {
      return <DungeonLevel level={level} />
    });
  }
  
  render() {
    return (
      <div className="Dungeon primary-dark">
        {this.getLevels()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    levels: state.dungeon.levels,
    exploredLevel: state.dungeon.exploredLevel
  }
}

export default connect(mapStateToProps)(Dungeon);