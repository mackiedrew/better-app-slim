/* @flow */

/**
 * This file should contain any interface to the Firebase Firestore API.
 */

import admin from "firebase-admin"

import { FIREBASE_ADMIN } from "../env"

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_ADMIN),
  databaseURL: "https://better-app-4321.firebaseio.com",
})
const firebaseApi = admin.firestore()
firebaseApi.settings({ timestampsInSnapshots: true })

export default firebaseApi
