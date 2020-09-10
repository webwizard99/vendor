import React from 'react';
import './MobileMenu.css';

// redux imports
import { connect } from 'react-redux';

// utility imports
import mobileScreens from '../../Utilities/mobileScreens';

class MobileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handlePrevious = this.handlePrevious.bind(this);
  }
  
  handlePrevious() {
    mobileScreens.previousScreen();
    mobileScreens.updateScreen();
  }

  handleNext() {
    mobileScreens.nextScreen();
    mobileScreens.updateScreen();
  }
  
  render() {
    return (
      <div className="MobileMenu">
        <span className="previousScreen screenArrow"
          onClick={this.handlePrevious}
        >&#8592;</span>
        <span className="mobileTitle">{this.props.mobileScreen}</span>
        <span className="nextScreen screenArrow"
          onClick={this.handleNext}
        >&#8594;</span>
        <div className="MobileDropdown">Store</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mobileScreen: state.mobileMenu.screen
  }
}

export default connect(mapStateToProps)(MobileMenu);