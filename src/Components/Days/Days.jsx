import React from 'react';
import './Days.css';

// import days controller from game code
import days from '../../game_modules/days';

// import redux modules
import { fetchDay } from '../../actions';
import { SET_MOBILE_DROPDOWN } from '../../actions/types';
import { connect } from 'react-redux'

class Days extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.handleNextDay = this.handleNextDay.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.fetchDay();
  }

  handleNextDay() {
    const currentDay = this.props.day;
    // set day in game
    days.setDay(currentDay + 1);
    if (this.props.mobileDropdown) {
      this.props.setMobileDropdown(false);
    }
    // set day in redux state;
    this.props.fetchDay();
  }

  render() {
    return (
      <div className="Days primary-surface">
        <div className="DayTitle">Day: {this.props.day}</div>
        <div className="nextDay button secondary" onClick={this.handleNextDay}
        >Finish Day</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    day: state.days.day,
    mobileDropdown: state.mobileMenu.dropdown
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchDay: () => dispatch(fetchDay()),
    setMobileDropdown: (value) => dispatch({ type: SET_MOBILE_DROPDOWN, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Days);