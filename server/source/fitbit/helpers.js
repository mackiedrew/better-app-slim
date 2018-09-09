/* @flow */

import { fitbitUsersCollection } from "../firestore/collections"

export const getFitbitUser = async (uid: string) => {
  const fitbitUser = fitbitUsersCollection.doc(uid)
  const fitbitUserDoc = await fitbitUser.get()
  const fitbitUserData = await fitbitUserDoc.data()
  return fitbitUserData
}

export default getFitbitUser
