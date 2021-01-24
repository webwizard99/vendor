import React from 'react';
import './DetailPCMenu.css';

// redux imports
import { connect } from 'react-redux';
import { SET_PC_DETAIL, SET_PC_DROPDOWN } from '../../actions/types';

// utility imports
import pcDetailMenus from '../../Utilities/pcDetailMenus';
import pcMenus from '../../Utilities/pcMenus';

class DetailPCMenu extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.getPCDropdown = this.getPCDropdown.bind(this);
  }

  componentDidMount() {
    pcDetailMenus.init();
  }

  handlePrevious() {
    pcDetailMenus.previousMenu();
    pcDetailMenus.updateMenu();
    if (this.props.pcDropdown) {
      this.props.setPcDropdown(false);
    }
  }

  handleNext() {
    pcDetailMenus.nextMenu();
    pcDetailMenus.updateMenu();
    if (this.props.pcDropdown) {
      this.props.setPcDropdown(false);
    }
  }

  handleDropdown() {
    this.props.setPcDropdown(!this.props.pcDropdown);
  }

  handleMenuChange(newMenu) {
    pcDetailMenus.setmenu(newMenu);
    pcDetailMenus.updateMenu();
    this.props.setPcDropdown(false);
  }

  getPCDropdown() {
    const allMenus = Object.values(pcMenus);
    if (!this.props.pcDropdown) {
      return false;
    }
    return (
      <div className="PCDropdown primary-dark">
        {allMenus.map(menu => {
          return (
            <div className="PCDropdownOption primary-medium"
              onClick={() => this.handleMenuChange(menu)}>
                {menu}
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div className="PCDetailMenu primary-saturated">
        <span className="previousMenu screenArrowPC"
          onClick={this.handlePrevious}
        >&#8592;</span>
        <span className="PCMenuTitle"
          onClick={this.handleDropdown}>{this.props.pcDetailMenu}</span>
        <span className="nextMenu screenArrowPC"
          onClick={this.handleNext}
        >&#8594;</span>
        {this.getPCDropdown()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    pcDetailMenu: state.pcMenu.detail,
    pcDropdown: state.pcMenu.dropdown
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPcDetailMenu: (detail) => dispatch({ type: SET_PC_DETAIL, detail: detail }),
    setPcDropdown: (value) => dispatch({ type: SET_PC_DROPDOWN, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailPCMenu);