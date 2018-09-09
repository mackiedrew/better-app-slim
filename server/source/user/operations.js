/* @flow */

import { lotsOfDate, dateRange, getDaysBetween } from "../helpers/date"
import type { Summary } from "../types/UserTypes"
import { fitbitUsersCollection, usersCollection } from "../firestore/collections"
import { getFitbitUser } from "../fitbit/helpers"
import { exploreValues } from "../helpers/math"
import { queryForDate, resolveDocs } from "../firestore/helpers"

export const getUser = (uid: string) => usersCollection.doc(uid)

export const createUser = async (uid: string) =>
  await usersCollection.doc(uid).set({ uid }, { merge: true })

export const userSummariesCollection = (uid: string) => getUser(uid).collection("summaries")

export const getUserSummary = (uid: string, dateTimeString: string) =>
  userSummariesCollection(uid).doc(dateTimeString)

export const createDateSummary = async (uid: string, date: Date) => {
  console.log(`Summarizing User: "${uid}" on Date: "${date.toDateString()}"`)
  const { dateString, timeString, dateTimeString, unixTimestamp } = lotsOfDate(date)
  // Create user summary document or fetch old one
  const userSummary = getUserSummary(uid, dateString)

  // Get profile options
  const fitbitUser = await getFitbitUser(uid)
  const gender = fitbitUser.profile.gender
  const height = fitbitUser.profile.height
  const age = fitbitUser.profile.age

  // Get Body Fat Logs
  const bodyFatCollection = fitbitUsersCollection.doc(uid).collection("bodyFatLogs")
  const bodyFatValues = await resolveDocs(queryForDate(bodyFatCollection, date))
  // console.log(bodyFatValues)
  const bodyFat = exploreValues(bodyFatValues.map(({ fat }) => fat))

  // Get Mass Logs
  const massCollection = fitbitUsersCollection.doc(uid).collection("massLogs")
  const massValues = await resolveDocs(queryForDate(massCollection, date))
  // console.log(massValues)
  const mass = exploreValues(massValues.map(({ weight }) => weight))

  // Construct final summary
  const summary: Summary = {
    date,
    dateString,
    timeString,
    dateTimeString,
    unixTimestamp,
    height,
    age,
    bodyFat,
    mass,
    gender,
  }
  await userSummary.set(summary)
  return summary
}

export const summarizeDateRange = (uid: string, startDate: Date, endDate: Date) => {
  const totalDays = getDaysBetween(startDate, endDate)
  const datesToSync = dateRange(totalDays, startDate)
  datesToSync.map(date => createDateSummary(uid, date))
}
