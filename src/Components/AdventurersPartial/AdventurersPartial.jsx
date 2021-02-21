import React from 'react';
import './AdventurersPartial.css';

// component imports
import Adventurer from '../Adventurer/Adventurer';

// redux imports
import { connect } from 'react-redux';
import { SET_PARTIAL_ADVENTURERS } from '../../actions/types';

// utility imports
import breadcrumb from '../../Utilities/breadcrumb';

class AdventurersPartial extends React.Component {
  constructor(props) {
    super(props);

    this.getAdventurers = this.getAdventurers.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.scrollCombatLog();
  }

  getAdventurers(adventurers) {
    return adventurers.map(adventurer => {
      return <Adventurer adventurer={adventurer} />
    });
  }

  scrollCombatLog() {
    const cLog = document.querySelector('.adventurer-combat-log');
    console.log(cLog);
    cLog.scrollTop = cLog.scrollHeight;
  }

  handleBack() {
    this.props.setPartialAdventurers(null);
    const handled = breadcrumb.popBreadcrumb();
    if (!handled) {
      console.log('breadcrumb failed!');
    }
  }

  render() {
    if (!this.props.adventurers || !this.props.partialAdventurers) return '';
    let partialAdventurers = this.props.partialAdventurers;
    let adventurers = this.props.adventurers;
    partialAdventurers = partialAdventurers.map(adventurerId => {
      return adventurers.find(adventurer => adventurer.id === adventurerId);
    })
    
    return (
      <div className="adventurers">
        <div className="back-button partial-back primary"
            onClick={this.handleBack}>&#8592;</div>
        {this.getAdventurers(partialAdventurers)}
        <div className="spacer-vertical"></div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    partialAdventurers: state.adventurers.partialAdventurers,
    adventurers: state.adventurers.adventurers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPartialAdventurers: (payload) => dispatch({ type: SET_PARTIAL_ADVENTURERS, payload: payload })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdventurersPartial);