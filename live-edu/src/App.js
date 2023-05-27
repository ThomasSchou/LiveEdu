import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home'
import './App.css';
import { Component } from 'react';


class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div className='main'>

            <Routes>
              <Route index element={<Home />} />

            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
