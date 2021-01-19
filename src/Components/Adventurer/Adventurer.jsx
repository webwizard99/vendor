import React from 'react';
import './Adventurer.css';

class Adventurer extends React.Component {

  render() {
    if (!this.props.adventurer) return '';
    const adventurer = this.props.adventurer;
    const adventurerClass = adventurer.adventurerClass;
    console.log(adventurerClass);
    const classIcon = adventurerClass.name.charAt(0);
    return (
      <div className="adventurerDisplay light">
        <div className="adventurerClassIcon">{classIcon}</div>
        <div className="adventurerDetails">
          <p className="adventurerName">{adventurer.name}</p>
          <p className="adventurerClass">{adventurerClass.name}</p>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">str</p>
            <p className="adventurerStat">{adventurer.strength}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">spd</p>
            <p className="adventurerStat">{adventurer.speed}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">cun</p>
            <p className="adventurerStat">{adventurer.cunning}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">int</p>
            <p className="adventurerStat">{adventurer.intelligence}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">con</p>
            <p className="adventurerStat">{adventurer.constitution}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Adventurer;