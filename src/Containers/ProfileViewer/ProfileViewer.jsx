import React from 'react';
import './ProfileViewer.css';

// redux imports
import { connect } from 'react-redux';
import { SET_PROFILE_ACTIVE } from '../../actions/types';

// utitlity imports
import userPutRequests from '../../Utilities/userPutRequests';

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

  handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log('handleSubmit');
    userPutRequests('user', data);
    this.props.setProfileActive(false);
  }
  
  render() {
    let newNickname = '';
    let newImportNickname = false;
    let newId = null;

    if (this.props.auth) {
      newNickname = this.props.auth.nickname;
      newImportNickname = this.props.auth.import_nickname;
      newId = this.props.auth.id;
    }

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
                  maxLength="40" defaultValue={newNickname}></input>
              </div>
              <div className="input-group">
                <input type="checkbox" name="import_nickname" id="import_nickname" class="input-checkbox" defaultChecked={newImportNickname}></input>
                <label className="item-label" htmlFor="import_nickname">Import nickname as store name by default</label>
              </div>
              <input type="hidden" name="id" value={newId} />
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
    profileActive: state.profile.active,
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProfileActive: (value) => dispatch({ type: SET_PROFILE_ACTIVE, value: value })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileViewer);