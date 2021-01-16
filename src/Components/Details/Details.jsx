import React from 'react';
import './Details.css';

import DetailPCMenu from '../DetailPCMenu/DetailPCMenu';

class Details extends React.Component {
  render() {
    return (
      <div className="Details">
        <DetailPCMenu />
      </div>
    )
  }
}

export default Details;