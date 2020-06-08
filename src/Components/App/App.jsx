import React from 'react';
import './App.css';

import MainGame from '../../Utilities/main';
import Days from '../Days/Days';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Days />
      </div>
    )
  }
}

export default App;