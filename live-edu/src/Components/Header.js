import { NavLink } from 'react-router-dom';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '../Services/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Header() {

  const [user] = useAuthState(auth);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err)
    }
    
  }

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err)
    }

  }

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
              {!user && (<div className='header-admin' onClick={signInWithGoogle}>login</div>)
              ||
              (<><div className='header-admin' onClick={logOut}>Log out</div>
              <div className='header-admin'>{user.displayName}</div></>)}
            </div>
          </ul>
        </header>
      </div>
    </div>
  );
}

export default Header;