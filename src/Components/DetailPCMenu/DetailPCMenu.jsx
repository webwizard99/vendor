import React from 'react';
import './DetailPCMenu.css';

// redux imports
import { connect } from 'react-redux';
import { SET_PC_DETAIL, SET_PC_DROPDOWN } from '../../actions/types';

// utility imports
import pcDetailMenus from '../../Utilities/pcDetailMenus';
import pcMenus from '../../Utilities/pcMenus';

class DetailPCMenu extends React.Component {

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