import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home'
import './App.css';
import { Component } from 'react';
import AllChannels from './Components/Discover';
import Discover from './Components/Discover';


class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div className='main'>

            <Routes>
              <Route index element={<Home />} />
              <Route path='/liveedu' element={<Home />} />
              <Route path='/discover' element={<Discover />} />

            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
