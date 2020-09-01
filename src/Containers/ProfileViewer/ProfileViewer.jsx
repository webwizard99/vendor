import React from 'react';
import './ProfileViewer.css';

// redux imports
import { connect } from 'react-redux';
import { SET_PROFILE_ACTIVE } from '../../actions/types';

class ProfileViewer extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    if (this.props.profileActive) {
      this.props.setProfileActive(false);
    }
  }
  
  render() {
    return (
      <div className="ProfileViewer">
        <div className="ProfileForm">

        </div>
        <div className="CloseButton"
          onClick={this.handleClose}>
            X
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    profileActive: state.profile.active
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProfileActive: (value) => dispatch({ type: SET_PROFILE_ACTIVE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileViewer);