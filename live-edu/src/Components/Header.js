import { NavLink } from 'react-router-dom';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, database, googleProvider } from '../Services/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createChannel } from '../Services/IVSApi';
import { doc, setDoc } from 'firebase/firestore';

function Header() {

  const [user] = useAuthState(auth);

  const signInWithGoogle = async () => {
    try {
      const credentials = await signInWithPopup(auth, googleProvider);
      console.log(credentials.user.displayName)
      var channel = await createChannel(credentials.user.displayName)

      console.log(channel)

      if (channel) {
        await setDoc(doc(database, "Users", credentials.user.displayName), {
          userId: credentials.user.uid,
          slug: credentials.user.displayName.replace(/\s/g, "-").toLowerCase(),
          playback: channel.channel.playbackUrl,
          channelArn: channel.channel.arn,
          streamKey: channel.streamKey.value
        });
      }

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
            <li><NavLink to={'/tags'} className="headerLinks">FOR YOU</NavLink></li>
            <li><NavLink to={'/discover'} className="headerLinks">NEW</NavLink></li>
          </ul>
          <ul className='linkLoginContainer'>
            <div class="container nav-container">
              {!user &&
                (<div className='header-admin' onClick={signInWithGoogle}>login</div>)
                ||
                (<><div className='header-admin' onClick={logOut}>Log out</div>
                  <li><NavLink to={'/admin'} className="headerLinks">Profil</NavLink></li></>
                )}
            </div>
          </ul>
        </header>
      </div>
    </div>
  );
}

export default Header;