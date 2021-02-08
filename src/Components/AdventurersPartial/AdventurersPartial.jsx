import React from 'react';
import './AdventurersPartial.css';

// component imports
import Adventurer from '../Adventurer/Adventurer';

// redux imports
import { connect } from 'react-redux';

// utility imports
import breadcrumb from '../../Utilities/breadcrumb';

class AdventurersPartial extends React.Component {
  constructor(props) {
    super(props);

    this.getAdventurers = this.getAdventurers.bind(this);
  }

  getAdventurers(adventurers) {
    return adventurers.map(adventurer => {
      return <Adventurer adventurer={adventurer} />
    });
  }

  handleBack() {
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
        <div className="back-button"
            onClick={this.handleBack}>&#8592;</div>
        {this.getAdventurers(partialAdventurers)}
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

export default connect(mapStateToProps)(AdventurersPartial);