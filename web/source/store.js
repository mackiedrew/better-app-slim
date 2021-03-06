/* @flow */
import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { connectRouter, routerMiddleware } from "connected-react-router"
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase"
import firebase from "firebase/app"
import { reduxFirestore, firestoreReducer } from "redux-firestore"
import { devToolsEnhancer } from "redux-devtools-extension"
import { reducer as formReducer } from "redux-form"

import "firebase/auth"
import "firebase/database"
import "firebase/firestore"

import history from "./history"

const firebaseConfig = {
  apiKey: "AIzaSyAvwWxHae0EalxkcnNuPEQpxWZ0CAQwZdk",
  authDomain: "better-app-4321.firebaseapp.com",
  databaseURL: "https://better-app-4321.firebaseio.com",
  projectId: "better-app-4321",
  storageBucket: "better-app-4321.appspot.com",
  messagingSenderId: "1026394435546",
}

const rrfConfig = {
  userProfile: null,
  useFirestoreForProfile: true,
}

firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({ timestampsInSnapshots: true })

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase),
  devToolsEnhancer({}),
)(createStore)

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  form: formReducer,
})
const store = createStoreWithFirebase(
  connectRouter(history)(rootReducer),
  {},
  compose(applyMiddleware(routerMiddleware(history))),
)

export default store
