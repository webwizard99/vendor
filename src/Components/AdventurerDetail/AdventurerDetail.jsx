import React from 'react';
import './AdventurerDetail.css';

// redux imports
import { connect } from 'react-redux';

// utility imports
import breadcrumb from '../../Utilities/breadcrumb';

class AdventurerDetail extends React.Component {
  constructor(props) {
    super(props);

    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    breadcrumb.popBreadcrumb();
  }
  
  render() {
    console.log(this.props.detailId);
    console.log(this.props.adventurers);
    if ((!this.props.detailId && this.props.detailId !== 0) || !this.props.adventurers) return '';
    const allAdventurers = this.props.adventurers;
    const thisAdventurer = allAdventurers.find(adventurer => adventurer.id === this.props.detailId);

    return (
      <div className="AdventurerDetail">
        <div className="title-bar">
          <div className="back-button"
            onClick={this.handleBack}>&#8592;</div>
          <div className="adventurer-title">{thisAdventurer.name}</div>
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    adventurers: state.adventurers.adventurers,
    detailId: state.detail.id
  }
}

export default connect(mapStateToProps)(AdventurerDetail);