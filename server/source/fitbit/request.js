/* @flow */
import fetch from "node-fetch"

import type { $Request, $Response } from "express"

import type { FitbitEndpoint, EndpointOptions, EndpointDateOnly } from "../types/FitbitTypes"

import { fitbitUsersCollection } from "../firestore/collections"

import {
  fitbitToRealDate,
  getPastDate,
  dateRange,
  getMonthsBetween,
  getDaysBetween,
  lotsOfDate,
  dateToFitbitTime,
} from "../helpers/date"

import { safeFirestoreInput } from "../firestore/helpers"

import { createDateSummary } from "../user/operations"

import * as endpoints from "./endpoints"
import { refreshTokens } from "./authorization"

export const get = async (
  userId: string,
  endpointCallback: FitbitEndpoint,
  options: EndpointOptions = {},
): Promise<{} | void> => {
  await refreshTokens(userId)
  const fitbitUser = fitbitUsersCollection.doc(userId)
  // Get accessToken & refresh token from user
  let fitbitUserData
  try {
    fitbitUserData = (await fitbitUser.get()).data()
  } catch (error) {
    console.error(error)
    return {}
  }
  // Construct query
  const Authorization = `Bearer ${fitbitUserData.accessToken}`
  const endpoint = endpointCallback(fitbitUserData.fitbitUserId)(options)
  console.log(`Calling: ${endpoint}`)
  const response = await fetch(endpoint, { method: "GET", headers: { Authorization } })
  const headers = response.headers
  const apiHealth = {
    remaining: headers.get("fitbit-rate-limit-remaining"),
    limit: headers.get("fitbit-rate-limit-limit"),
    reset: headers.get("fitbit-rate-limit-reset"),
  }
  console.log(
    `Remaining calls this hour: ${apiHealth.remaining} / ${apiHealth.limit} for another ${Math.ceil(
      apiHealth.reset / 60,
    )}min`,
  )
  const data = await response.json()
  if (data.success === false) console.log(response.headers)
  return data
}

export const syncProfile = async (userId: string) => {
  const fitbitResponse = await get(userId, endpoints.profile)
  const user = fitbitResponse && fitbitResponse.user ? fitbitResponse.user : {}
  const fitbitUser = fitbitUsersCollection.doc(userId)
  fitbitUser.update(safeFirestoreInput({ profile: user }), { merge: true })
}

export const syncMass = async (userId: string, options: EndpointOptions) => {
  const rawWeights = ((await get(userId, endpoints.weight, options)) || { weight: [] }).weight || {}
  const weights = rawWeights instanceof Array ? rawWeights : []
  const fitbitUser = fitbitUsersCollection.doc(userId)
  weights.map(massLog => {
    const { logId, bmi, date: fitbitDate, time, source, weight } = massLog
    const date = fitbitToRealDate(fitbitDate, time)
    const dateSet = lotsOfDate(date)
    fitbitUser
      .collection("massLogs")
      .doc(`${logId}`)
      .set(safeFirestoreInput({ logId, bmi, ...dateSet, source, weight }), { merge: true })
  })
}

export const syncBodyFat = async (userId: string, options: EndpointOptions) => {
  const rawBodyFatLogs = ((await get(userId, endpoints.bodyFat, options)) || { fat: [] }).fat || {}
  const bodyFatLogs = rawBodyFatLogs instanceof Array ? rawBodyFatLogs : []
  const fitbitUser = fitbitUsersCollection.doc(userId)
  bodyFatLogs.map(bodyFatLog => {
    const { logId, fat, date: fitbitDate, time, source } = bodyFatLog
    const date = fitbitToRealDate(fitbitDate, time)
    const dateSet = lotsOfDate(date)
    fitbitUser
      .collection("bodyFatLogs")
      .doc(`${logId}`)
      .set(safeFirestoreInput({ logId, source, fat, ...dateSet }), { merge: true })
  })
}

export const syncSleep = async (userId: string, options: EndpointOptions) => {
  const rawSleepLogs = ((await get(userId, endpoints.sleep, options)) || { sleep: [] }).sleep || {}
  const sleepLogs = rawSleepLogs instanceof Array ? rawSleepLogs : []
  sleepLogs.map(async log => {
    const dateSet = lotsOfDate(options.date)
    await fitbitUsersCollection
      .doc(userId)
      .collection("sleepLogs")
      .doc(`${log.logId}`)
      .set(safeFirestoreInput({ ...log, startTime: new Date(log.startTime) }), { merge: true })
  })
}

export const syncActivitySummary = async (userId: string, options: EndpointDateOnly) => {
  const data = await get(userId, endpoints.dailyActivity, options)
  const dateSet = lotsOfDate(options.date)
  await fitbitUsersCollection
    .doc(userId)
    .collection("activitySummary")
    .doc(options.date.toDateString())
    .set(safeFirestoreInput({ ...data, ...dateSet }), { merge: true })
}

export const syncFoodLog = async (userId: string, options: EndpointDateOnly) => {
  const data = await get(userId, endpoints.foodLog, options)
  const dateSet = lotsOfDate(options.date)
  await fitbitUsersCollection
    .doc(userId)
    .collection("foodLogs")
    .doc(options.date.toDateString())
    .set(safeFirestoreInput({ ...data, ...dateSet }), { merge: true })
}

export const getAllUserIds = async () => {
  const querySnapshot = await fitbitUsersCollection.get()
  const docSnapshots = querySnapshot.docs
  const userIds = docSnapshots.map(({ id }) => id)
  return userIds
}

// Sync the last week because it's possible that old data has been updated
export const syncDayOneUser = async (userId: string, date: Date = new Date()) => {
  await syncProfile(userId)
  await syncMass(userId, { date })
  await syncBodyFat(userId, { date })
  await syncSleep(userId, { date })
  await syncActivitySummary(userId, { date })
  await createDateSummary(userId, date)
  return true
}

// Sync the last week because it's possible that old data has been updated
export const syncWeekOneUser = async (userId: string) => {
  const daysAgo = 7
  const oneWeekAgo = getPastDate(daysAgo)
  await syncProfile(userId)
  console.log(oneWeekAgo)
  return await Promise.all(
    dateRange(daysAgo, oneWeekAgo).map(async date => {
      await syncMass(userId, { date })
      await syncBodyFat(userId, { date })
      await syncSleep(userId, { date })
      await syncActivitySummary(userId, { date })
      await createDateSummary(userId, date)
    }),
  )
}

export const syncToday = async (request: $Request, response: $Response) => {
  const userIds = await getAllUserIds()
  await Promise.all(userIds.map(userId => syncDayOneUser(userId)))
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  response.send("Synced!")
}

export const syncDay = async (request: $Request, response: $Response) => {
  const { date } = request.query
  if (!date) return response.send("Please specify date!")
  const userIds = await getAllUserIds()
  await Promise.all(userIds.map(async userId => await syncDayOneUser(userId, date)))
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  response.send("Synced!")
}

export const syncWeekWithoutResponse = async () => {
  const userIds = await getAllUserIds()
  userIds.map(syncWeekOneUser)
}

export const syncWeek = async (request: $Request, response: $Response) => {
  await syncWeekWithoutResponse()
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  response.send("Synced!")
}

export const getFitbitUser = async (uid: string) => {
  const fitbitUser = fitbitUsersCollection.doc(uid)
  const fitbitUserDoc = await fitbitUser.get()
  const fitbitUserData = await fitbitUserDoc.data()
  return fitbitUserData
}

export const fullSync = async (uid: string) => {
  await syncProfile(uid)
  const { profile } = await getFitbitUser(uid)
  const earliestDataDate = new Date(...profile.memberSince.split("-").map(parseFloat))
  console.log(earliestDataDate)
  const today = new Date()
  // const monthsToSync = getMonthsBetween(earliestDataDate, today)
  const daysBetween = getDaysBetween(earliestDataDate, today)
  const daysToSync = dateRange(daysBetween, earliestDataDate).slice(0, 800)
  // await Promise.all(
  //   monthsToSync.map(async date => {
  //     // await syncMass(uid, { date, period: "1m" })
  //     // await syncBodyFat(uid, { date, period: "1m" })
  //   }),
  // )
  await Promise.all(
    daysToSync.map(async date => {
      // await syncSleep(uid, { date })
      await syncFoodLog(uid, { date })
      // Food Logs
    }),
  )
}
