import React from 'react';
import './DungeonLevel.css';


// redux imports
import { connect } from 'react-redux';
import { SET_PARTIAL_ADVENTURERS, SET_MOBILE_SCREEN, SET_PC_DETAIL } from '../../actions/types';

// utility imports
import breadcrumb from '../../Utilities/breadcrumb';
import screenInfo from '../../Utilities/screenInfo';
import mobileScreens from '../../Utilities/mobileScreens';
import pcMenus from '../../Utilities/pcMenus';

class DungeonLevel extends React.Component {
  constructor(props) {
    super(props);

    this.handleAdventurerList = this.handleAdventurerList.bind(this);
  }

  handleAdventurerList(levelAdventurers) {
    const adventurerIds = levelAdventurers.map(adventurer => adventurer.adventurerId);
    console.log(adventurerIds);
    this.props.setPartialAdventurers(adventurerIds);
    const dunDOM = document.querySelector('.Dungeon');
    const scrollY = dunDOM.scrollTop;
    breadcrumb.addBreadcrumb({ display: 'dungeon', screenPos: scrollY});
    if (screenInfo.getIsMobile()) {
      const allScreens = mobileScreens.getAllScreens();
      this.props.setMobileScreen(allScreens.adventurersPartial);
    } else {
      this.props.setPCDetail(pcMenus.adventurersPartial);
    }
  }

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
        <div className="adventurersNumberContainer">
          <div className="adventurersNumber"
            onClick={() => this.handleAdventurerList(levelAdventurers)}>
            {levelAdventurers.length > 0 ? (levelAdventurers.length) : ''}
          </div>
          <div className="adventurersNumberLabel">adventurers</div>
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

const mapDispatchToProps = dispatch => {
  return {
    setPartialAdventurers: (payload) => dispatch({ type: SET_PARTIAL_ADVENTURERS, payload: payload }),
    setMobileScreen: (screen) => dispatch({ type: SET_MOBILE_SCREEN, screen: screen }),
    setPCDetail: (detail) => dispatch({ type: SET_PC_DETAIL, detail: detail })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DungeonLevel);