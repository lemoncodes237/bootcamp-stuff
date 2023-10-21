import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import firebase from 'firebase/compat/app';
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import {
  ReactReduxFirebaseProvider,
  firebaseReducer
} from 'react-redux-firebase'
import {composeWithDevTools} from 'redux-devtools-extension';

const firebaseConfig = {
    apiKey: "AIzaSyDrfUVi7jYak6qhekY__k2DuSeXdBMUvWQ",
    authDomain: "datamatch-bootcamp-90df1.firebaseapp.com",
    databaseURL: "https://datamatch-bootcamp-90df1-default-rtdb.firebaseio.com",
    projectId: "datamatch-bootcamp-90df1",
    storageBucket: "datamatch-bootcamp-90df1.appspot.com",
    messagingSenderId: "660332250853",
    appId: "1:660332250853:web:bba4210018324ac2e6f60c"
};

firebase.initializeApp(firebaseConfig);

// Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer
    // firestore: firestoreReducer // <- needed if using firestore
  });
  
  // Create store with reducers and initial state
  const store = createStore(rootReducer, composeWithDevTools());

  // react-redux-firebase config
const rrfConfig = {
    userProfile: 'users'
    // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
    // enableClaims: true // Get custom claims along with the profile
  }

  const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch
    // createFirestoreInstance // <- needed if using firestore
  }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <BrowserRouter>
                <App />
            </BrowserRouter> 
        </ReactReduxFirebaseProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
