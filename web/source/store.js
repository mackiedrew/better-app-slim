/* @flow */
import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { connectRouter, routerMiddleware } from "connected-react-router"
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase"
import firebase from "firebase/app"
import { reduxFirestore, firestoreReducer } from "redux-firestore"
import { devToolsEnhancer } from "redux-devtools-extension"

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
  userProfile: "users",
  useFirestoreForProfile: true,
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()

const createStoreWithFirebase = compose(
  devToolsEnhancer({}),
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase),
)(createStore)

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
})
const store = createStoreWithFirebase(
  connectRouter(history)(rootReducer),
  {},
  compose(applyMiddleware(routerMiddleware(history))),
)

export default store
