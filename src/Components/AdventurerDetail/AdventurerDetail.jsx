import React from 'react';
import './AdventurerDetail.css';

// library imports
import reactStringReplace from 'react-string-replace';

// redux imports
import { connect } from 'react-redux';

// utility imports
import breadcrumb from '../../Utilities/breadcrumb';
import tagProcessor from '../../Utilities/tagProcessor';

class AdventurerDetail extends React.Component {
  constructor(props) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
  }

  getInventory(adventurer) {
    const adventurerInventory = adventurer.inventory;
    if (!adventurerInventory) return 'no inventory';
    return adventurerInventory.map(item => {
      return (
        <div className="adventurerInventoryItem">{item.name}</div>
      )
    })
  }

  getCombatLog(adventurer) {
    if (!adventurer) return 'no combat log';
    const adventurerCombatLog = adventurer.getCombatLog();
    if (adventurerCombatLog.length <= 0) {
      return 'No combat log entries.'
    }

    return adventurerCombatLog.map(logEntry => {
      let processedEntry = logEntry;
      
      processedEntry = reactStringReplace(/%name%\w*%endname%/, (match, i) => {
        const tags = tagProcessor.getTags();
        let text = match;
        text = text.replace(tags.nameStart, '');
        text = text.replace(tags.nameEnd, '');
        return (
          <span key={i} className="adventurerName">{text}</span>
        )
      });

      processedEntry = reactStringReplace(/%status%\w*%endstatus%/, (match, i) => {
        const tags = tagProcessor.getTags();
        let text = match;
        text = text.replace(tags.statusStart, '');
        text = text.replace(tags.statusEnd, '');
        return (
          <span key={i} className="status">{text}</span>
        )
      });

      return (
        <div className="combatLogEntry">
          {processedEntry}
        </div>
      )
    });
    
  }

  handleBack() {
    const handled = breadcrumb.popBreadcrumb();
    if (!handled) {
      console.log('breadcrumb failed!');
    }
  }
  
  render() {
    if ((!this.props.detailId && this.props.detailId !== 0) || !this.props.adventurers) return '';
    const allAdventurers = this.props.adventurers;
    const thisAdventurer = allAdventurers.find(adventurer => adventurer.id === this.props.detailId);
    const adventurerClass = thisAdventurer.adventurerClass;
    const classColors = {
      thief: 'thief',
      bard: 'bard',
      soldier: 'soldier'
    }
    let adventurerClassColor, adventurerClassIconColor;
    adventurerClassIconColor = "adventurerClassIcon"
    adventurerClassColor = "adventurerClass";
    adventurerClassColor += ` ${classColors[adventurerClass.name]}`
    adventurerClassIconColor += ` ${classColors[adventurerClass.name]}`
    const classIcon = adventurerClass.name.charAt(0);
    
    return (
      <div className="AdventurerDetail primary">
        <div className="title-bar">
          <div className="back-button"
            onClick={this.handleBack}>&#8592;</div>
          <div className="adventurer-title">{thisAdventurer.name}</div>
        </div>
        <div className="primary-stats-bar">
          <div className={adventurerClassIconColor}>{classIcon}</div>
          <div className="primary-cascade">
            <div className="adventurerStatGroupWide">
              <p className="adventurerStatLabel">exp</p>
              <p className="adventurerStat">{thisAdventurer.experience}</p>
            </div>
            <div className="adventurerStatGroupWide">
              <p className="adventurerStatLabel">lvl</p>
              <p className="adventurerStat">{thisAdventurer.level}</p>
            </div>
          </div>
        </div>
        <div className="adventurerDetailsView">
          <div className="adventurerStatGroup">
            <p className={adventurerClassColor}>{adventurerClass.name}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">gold</p>
            <p className="adventurerStat">{thisAdventurer.gold}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">hp</p>
            <p className="adventurerStat">{thisAdventurer.hp}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">str</p>
            <p className="adventurerStat">{thisAdventurer.strength}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">spd</p>
            <p className="adventurerStat">{thisAdventurer.speed}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">cun</p>
            <p className="adventurerStat">{thisAdventurer.cunning}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">int</p>
            <p className="adventurerStat">{thisAdventurer.intelligence}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">con</p>
            <p className="adventurerStat">{thisAdventurer.constitution}</p>
          </div>
        </div>
        <p className="adventurerInventoryHeadline">Inventory</p>
        <div className="adventurerInventoryDetails">
          {this.getInventory(thisAdventurer)}
        </div>
        <p className="adventurerInventoryHeadline">Combat Log</p>
        <div className="adventurer-combat-log">
          {this.getCombatLog(thisAdventurer)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    adventurers: state.adventurers.adventurers,
    detailId: state.detail.id
  }
}

export default connect(mapStateToProps)(AdventurerDetail);