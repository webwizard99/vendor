import React from 'react';
import './DungeonLevel.css';


// redux imports
import { connect } from 'react-redux';

// utility imports

class DungeonLevel extends React.Component {
  render() {
    if (!this.props.level) return '';
    const level = this.props.level;
    console.log(level);
    let levelAdventurers = [];
    const dungeonAdventurers = this.props.dungeonAdventurers;
    if (dungeonAdventurers) {
      levelAdventurers = dungeonAdventurers.filter(adventurer => adventurer.level === level.number);
    }
    return (
      <div className="levelDisplay primary">
        <div className="levelNumber">{level.number}</div>
        <div className="adventurersNumber">
          {levelAdventurers.length > 0 ? (levelAdventurers.length + 1) : ''}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    dungeonAdventurers: state.dungeon.adventurers
  }
}

export default connect(mapStateToProps)(DungeonLevel);