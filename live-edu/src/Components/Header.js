import { NavLink } from 'react-router-dom';

function Header() {

  return (
    <div>
      <div className='headerFiller'></div>
      
      <div className='headerContainer'>

        <header className='header' id='header'>
          <div className='logoContainer'>
            <NavLink to={'/'}><img className='logo'></img></NavLink>
          </div>
          <ul className='linkContainer'>
            <li><NavLink to={'/follows'} className="headerLinks">FØLGER</NavLink></li>
            <li><NavLink to={'/discover'} className="headerLinks">TIL DIG</NavLink></li>
          </ul>
          <ul className='linkLoginContainer'>
            <div class="container nav-container">
            </div>
          </ul>
        </header>
      </div>
    </div>
  );
}

export default Header;