import React from 'react';
import './Adventurer.css';

// redux imports
import { connect } from 'react-redux';
import { SET_DETAIL_ID, SET_MOBILE_SCREEN, SET_PC_DETAIL } from '../../actions/types';

// utility imports
import breadcrumb from '../../Utilities/breadcrumb';
import screenInfo from '../../Utilities/screenInfo';
import mobileScreens from '../../Utilities/mobileScreens';
import pcMenus from '../../Utilities/pcMenus';

class Adventurer extends React.Component {
  constructor(props) {
    super(props);

    this.handleZoom = this.handleZoom.bind(this);
  }

  handleZoom() {
    if (!this.props.adventurer) return;
    const partialAdventurers = this.props.partialAdventurers;
    let breadcrumbName = 'adventurers';
    console.log(partialAdventurers);
    if (partialAdventurers) {
      if (partialAdventurers.find(adventurerId => adventurerId === this.props.adventurer.id)) {
        breadcrumbName = 'adventurersPartial';
      }
    }
    console.log(breadcrumbName);
    this.props.setDetailId(this.props.adventurer.id);
    const advDOM = document.querySelector('.adventurers');
    const scrollY = advDOM.scrollTop;
    console.log(scrollY);
    breadcrumb.addBreadcrumb({ display: breadcrumbName, screenPos: scrollY });
    if (screenInfo.getIsMobile()) {
      const allScreens = mobileScreens.getAllScreens();
      this.props.setMobileScreen(allScreens.adventurer);
    } else {
      this.props.setPCDetail(pcMenus.adventurer);
    }
  }

  render() {
    if (!this.props.adventurer) return '';
    const adventurer = this.props.adventurer;
    const adventurerClass = adventurer.adventurerClass;
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
      <div className="adventurerDisplay primary"
        onClick={this.handleZoom}
      >
        <div className={adventurerClassIconColor}>{classIcon}</div>
        <div className="adventurerDetails">
          <p className="adventurerName">{adventurer.name}</p>
          <p className={adventurerClassColor}>{adventurerClass.name}</p>
          <div className="adventurerStatGroupWide">
            <p className="adventurerStatLabel">exp</p>
            <p className="adventurerStat">{adventurer.experience}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">lvl</p>
            <p className="adventurerStat">{adventurer.level}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">gold</p>
            <p className="adventurerStat">{adventurer.gold}</p>
          </div>
          <div className="adventurerStatGroup">
            <p className="adventurerStatLabel">hp</p>
            <p className="adventurerStat">{adventurer.hp}</p>
          </div>
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

const mapStateToProps = state => {
  return {
    partialAdventurers: state.adventurers.partialAdventurers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDetailId: (id) => dispatch({ type: SET_DETAIL_ID, id: id }),
    setMobileScreen: (screen) => dispatch({ type: SET_MOBILE_SCREEN, screen: screen }),
    setPCDetail: (detail) => dispatch({ type: SET_PC_DETAIL, detail: detail })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Adventurer);