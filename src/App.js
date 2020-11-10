import './App.css';
import firebase from "firebase/app";
import "firebase/auth"
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig)
function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignout = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signOutUser);
      })
      .catch(err => {
        // An error happened.
      });
  }
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { email, photoURL, displayName } = res.user;
        console.log(email, photoURL, displayName);
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
    console.log("Sign Clicked");
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button className='btn btn-primary' onClick={handleSignout}>Sign out</button> :
          <button onClick={handleSignIn}>Sign in</button>
      }
      <div style={{ border: "1px slid red" }} className="container">
        {
          user.isSignedIn && <div>
            <p>Welcome , {user.name}</p><br />
            <p>Your Email : {user.email}</p><br />
            <img src={user.photo} alt="" />
          </div>


        }
      </div>
    </div>
  );
}

export default App;
