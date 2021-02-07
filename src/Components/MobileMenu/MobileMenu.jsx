import React from 'react';
import './MobileMenu.css';

// component imports
import Days from '../Days/Days';

// redux imports
import { connect } from 'react-redux';
import { SET_MOBILE_DROPDOWN } from '../../actions/types';

// utility imports
import mobileScreens from '../../Utilities/mobileScreens';

class MobileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleScreenChange = this.handleScreenChange.bind(this);
    this.getMobileDropdown = this.getMobileDropdown.bind(this);
  }

  componentDidMount() {
    mobileScreens.init();
  }
  
  handlePrevious() {
    mobileScreens.previousScreen();
    mobileScreens.updateScreen();
    if (this.props.mobileDropdown) {
      this.props.setMobileDropdown(false);
    }
  }

  handleNext() {
    mobileScreens.nextScreen();
    mobileScreens.updateScreen();
    if (this.props.mobileDropdown) {
      this.props.setMobileDropdown(false);
    }
  }

  handleDropdown() {
    this.props.setMobileDropdown(!this.props.mobileDropdown)
  }

  handleScreenChange(newScreen) {
    mobileScreens.setScreen(newScreen);
    mobileScreens.updateScreen();
    this.props.setMobileDropdown(false);
  }

  getMobileDropdown() {
    const allScreens = mobileScreens.getScreens();
    if (this.props.mobileDropdown) {
      return (
        <div className="MobileDropdown primary-medium">
          <Days />
          {allScreens.map(screen => {
            return (
              <div className="mobileDropdownOption"
                onClick={() => this.handleScreenChange(screen)}>{screen}</div>
            )
      })}
      </div>)
      
    } else {
      return false;
    }
  }
  
  render() {
    return (
      <div className="MobileMenu primary-saturated">
        <span className="previousScreen screenArrow"
          onClick={this.handlePrevious}
        >&#8592;</span>
        <span className="mobileTitle"
          onClick={this.handleDropdown}>{this.props.mobileScreen}</span>
        <span className="nextScreen screenArrow"
          onClick={this.handleNext}
        >&#8594;</span>
        {this.getMobileDropdown()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mobileScreen: state.mobileMenu.screen,
    mobileDropdown: state.mobileMenu.dropdown,
    dungeonLevelExplored: state.dungeon.exploredLevel
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMobileDropdown: (value) => dispatch({ type: SET_MOBILE_DROPDOWN, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);