import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  });

  //Create an instance of the Google provider object
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      const {displayName, photoURL, email} = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      };
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
      
    })
  };

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(response => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      };
      setUser(signedOutUser);
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
  };

  return (
    <div className="App">
      {
        user.isSignedIn ? 
          <button onClick={handleSignOut}>Sign Out</button> : 
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <h4>Welcome {user.name}</h4>
          <h4>Your Email: {user.email}</h4>
          <img src={user.photo} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;
