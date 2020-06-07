import React from 'react';
import './App.css';

import MainGame from '../../Utilities/main';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        App
        Day: {MainGame.getDay()}
        
      </div>
    )
  }
}

export default App;