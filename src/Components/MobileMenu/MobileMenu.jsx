import React from 'react';
import './MobileMenu.css';

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
    this.getMobileDropdown = this.getMobileDropdown.bind(this);
  }

  componentDidMount() {
    mobileScreens.init();
  }
  
  handlePrevious() {
    mobileScreens.previousScreen();
    mobileScreens.updateScreen();
  }

  handleNext() {
    mobileScreens.nextScreen();
    mobileScreens.updateScreen();
  }

  handleDropdown() {
    console.log('handleDropdown');
    console.log(this.props.mobileDropdown);
    this.props.setMobileDropdown(!this.props.mobileDropdown)
  }

  getMobileDropdown() {
    if (this.props.mobileDropdown) {
      return (
        <div className="MobileDropdown">Store</div>
      )
    } else {
      return false;
    }
  }
  
  render() {
    return (
      <div className="MobileMenu">
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
    mobileDropdown: state.mobileMenu.dropdown
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMobileDropdown: (value) => dispatch({ type: SET_MOBILE_DROPDOWN, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);