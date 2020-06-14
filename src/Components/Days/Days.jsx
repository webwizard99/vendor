import React from 'react';
import './Days.css';

// import days controller from game code
import days from '../../Utilities/days';

// import redux modules
import { SET_DAY } from '../../actions/types';
import { connect } from 'react-redux'

class Days extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleNextDay = this.handleNextDay.bind(this);
  }

  handleNextDay() {
    const currentDay = this.props.day;
    // set day in game
    days.setDay(currentDay + 1);
    // set day in redux state;
    this.props.setDay(days.getDay());
  }

  render() {
    return (
      <div className="Days">
        Day: {this.props.day}
        <br />
        <button className="nextDay" onClick={this.handleNextDay}
        >Finish Day</button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    day: state.days.day
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDay: (day) => dispatch({ type: SET_DAY, day: day })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Days);