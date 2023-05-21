import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Component } from 'react';
import Home from './Components/Home';
import Header from './Components/Header';




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

