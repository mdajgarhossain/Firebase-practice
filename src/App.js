import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {

//Create an instance of the Google provider object
const provider = new firebase.auth.GoogleAuthProvider();

  return (
    <div className="App">
      <button>Sign In</button>
    </div>
  );
}

export default App;
