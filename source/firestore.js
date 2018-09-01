/* @flow */

/**
 * This file should contain any interface to the Firebase Firestore API.
 */

import admin from "firebase-admin"

import serviceAccount from "../serviceAccountKey"

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

export default admin.firestore()
