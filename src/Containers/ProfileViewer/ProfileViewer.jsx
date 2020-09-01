import React from 'react';
import './ProfileViewer.css';

// redux imports
import { connect } from 'react-redux';
import { SET_PROFILE_ACTIVE } from '../../actions/types';

class ProfileViewer extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClose() {
    if (this.props.profileActive) {
      this.props.setProfileActive(false);
    }
  }

  handleSubmit() {
    console.log('handleSubmit');
    this.props.setProfileActive(false);
  }
  
  render() {
    return (
      <div className="ProfileViewer">
        <div className="ProfileForm">
          <form action={'/profile'}
            className="input-fields-area"
            id="ProfileForm"
            method="POST"
            onSubmit={this.handleSubmit}>
              <div className="input-group">
                <label className="item-label" htmlFor="nickname">Nickname</label>
                <input type="text" name="nickname" id="nickname" className="input-text" placeholder="nickname"
                  maxLength="40" defaultValue={''}></input>
              </div>
              <div className="input-group">
                <input type="checkbox" name="import_nickname" id="import_nickname" class="input-checkbox"></input>
                <label className="item-label" htmlFor="import_nickname">Import nickname as store name by default</label>
              </div>
              <input type="submit" value="Update Profile" className="button profile-submit"></input>
          </form>
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