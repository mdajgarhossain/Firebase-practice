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
        password: '',
        photo: '',
        error: '',
        isValid: false,
        existingUser: false
      };
      setUser(signedOutUser);
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
  };

  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = event => {
    const createdUser = {...user};
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);
    console.log(createdUser);
  }

  //For password authentication
  //Step 1:
  const handleChange = event => {
    const newUserInfo = {
      ...user
    };
    
    // debugger;
    //perform validation
    let isValid = true;
    if(event.target.name === 'email') {
      isValid = is_valid_email(event.target.value);
    }
    if(event.target.name === 'password') {
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    // console.log(newUserInfo);
    // console.log(event.target.name, event.target.value);
  };

  const createAccount = (event) => {
    if(user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log(response);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  };

  const signInUser = event => {
    if(user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log(response);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    
    event.preventDefault();
    event.target.reset();
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

      {/* password authentication */}
      {/* Step 1: */}
      <h1>Our Custom Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">Returning User</label> 
      <form style={{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" id="" placeholder="Enter your email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" id="" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="SignIn"/>
      </form>
      <br/>

      <form style={{display: user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" id="" placeholder="Enter your name" required/>
        <br/>
        <input type="text" onBlur={handleChange} name="email" id="" placeholder="Enter your email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" id="" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
