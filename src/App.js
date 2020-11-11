import './App.css';
import firebase from "firebase/app";
import "firebase/auth"
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig)
function App() {
  const [newUser, setNewUser] = useState(false)
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
          photo: '',
          error: '',
          success: false
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
  const handleSubmit = (e) => {
    // console.log("Submitted");
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const userInfo = { ...user };
          userInfo.error = '';
          userInfo.success = true;
          setUser(userInfo)
        })
        .catch(error => {
          const userInfo = { ...user };
          userInfo.error = error.message;
          userInfo.success = false;
          setUser(userInfo)
          // ...
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const userInfo = { ...user };
          userInfo.error = '';
          userInfo.success = true;
          setUser(userInfo)
        })
        .catch(error => {
          const userInfo = { ...user };
          userInfo.error = error.message;
          userInfo.success = false;
          setUser(userInfo)
          // ...
        });
    }
    e.preventDefault()
  }
  const handleChange = event => {
    let isFormValid = true;
    if (event.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);

    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
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
      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>

        {newUser && <input onBlur={handleChange} name="name" type="text" placeholder="Enter Your Name" required />}<br />
        <input onBlur={handleChange} name="email" type="text" placeholder="Enter Your Email" required /><br />
        <br />
        <input onBlur={handleChange} name="password" type="password" placeholder="Enter Your Password" /><br />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Login'} Successfully</p>}
    </div>
  );
}

export default App;
