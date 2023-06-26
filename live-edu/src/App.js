import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home'
import './App.css';
import { Component } from 'react';
import Discover from './Components/Discover';
import Admin from './Components/Admin';
import Live from './Components/Live';
import DiscoverTags from './Components/DiscoverTags';


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
              <Route path='/admin' element={<Admin />} />
              <Route path="/live/:slug" element={<Live /> } />
              <Route path="/tags" element={<DiscoverTags /> } />

            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
