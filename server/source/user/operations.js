/* @flow */

import { makeDateString, makeTimeString, makeDateTimeString } from "../helpers/date"
import type { Summary } from "../types/UserTypes"
import { fitbitUsersCollection, usersCollection } from "../firestore/collections"

export const getUser = (uid: string) => usersCollection.doc(uid)

export const createUser = async (uid: string) =>
  await usersCollection.doc(uid).set({ uid }, { merge: true })

export const userSummariesCollection = (uid: string) => getUser(uid).collection("summaries")

export const getUserSummary = (uid: string, dateTimeString: string) =>
  userSummariesCollection(uid).doc(dateTimeString)

export const createDateSummary = async (uid: string, date: Date) => {
  const dateString = makeDateString(date)
  const userSummary = getUserSummary(uid, dateString)
  const height = 0 // DOOO
  const summary: Summary = {
    date,
    dateString,
    timeString: makeTimeString(date),
    dateTimeString: makeDateTimeString(date),
    unixTimestamp: date.getTime(),
    height,
  }
  userSummary.set(summary)
  return summary
}
