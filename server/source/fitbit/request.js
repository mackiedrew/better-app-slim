/* @flow */
import fetch from "node-fetch"

import type { $Request, $Response } from "express"

import type { FitbitEndpoint, EndpointOptions } from "../types/FitbitTypes"

import { fitbitUsersCollection } from "../firestore/collections"

import { fitbitToRealDate, getPastDate, dateRange } from "../helpers/date"

import { safeFirestoreInput } from "../firestore/helpers"

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
  console.log(endpoint)
  const response = await fetch(endpoint, { method: "GET", headers: { Authorization } })
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

export const syncMass = async (userId: string, date: Date) => {
  const rawWeights =
    ((await get(userId, endpoints.weight, { date })) || { weight: [] }).weight || {}
  const weights = rawWeights instanceof Array ? rawWeights : []
  const fitbitUser = fitbitUsersCollection.doc(userId)
  weights.map(massLog => {
    const { logId, bmi, date: fitbitDate, time, source, weight } = massLog
    const dateTime = fitbitToRealDate(fitbitDate, time)
    fitbitUser
      .collection("massLogs")
      .doc(`${logId}`)
      .set(safeFirestoreInput({ logId, bmi, dateTime, source, weight }), { merge: true })
  })
}

export const syncBodyFat = async (userId: string, date: Date) => {
  const rawBodyFatLogs = ((await get(userId, endpoints.bodyFat, { date })) || { fat: [] }).fat || {}
  const bodyFatLogs = rawBodyFatLogs instanceof Array ? rawBodyFatLogs : []
  const fitbitUser = fitbitUsersCollection.doc(userId)
  bodyFatLogs.map(bodyFatLog => {
    const { logId, fat, date: fitbitDate, time, source } = bodyFatLog
    const dateTime = fitbitToRealDate(fitbitDate, time)
    fitbitUser
      .collection("bodyFatLogs")
      .doc(`${logId}`)
      .set(safeFirestoreInput({ logId, source, fat, dateTime }), { merge: true })
  })
}

export const syncSleep = async (userId: string, date: Date) => {
  const rawSleepLogs = ((await get(userId, endpoints.sleep, { date })) || { sleep: [] }).sleep || {}
  const sleepLogs = rawSleepLogs instanceof Array ? rawSleepLogs : []
  sleepLogs.map(async log => {
    await fitbitUsersCollection
      .doc(userId)
      .collection("sleepLogs")
      .doc(`${log.logId}`)
      .set(safeFirestoreInput({ ...log, startTime: new Date(log.startTime) }), { merge: true })
  })
}

export const syncActivitySummary = async (userId: string, date: Date) => {
  const data = await get(userId, endpoints.dailyActivity, { date })
  await fitbitUsersCollection
    .doc(userId)
    .collection("activitySummary")
    .doc(date.toDateString())
    .set(safeFirestoreInput({ ...data, date }), { merge: true })
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
  await syncMass(userId, date)
  await syncSleep(userId, date)
  await syncBodyFat(userId, date)
  await syncActivitySummary(userId, date)
  return true
}

// Sync the last week because it's possible that old data has been updated
export const syncWeekOneUser = async (userId: string) => {
  const daysAgo = 7
  const oneWeekAgo = getPastDate(daysAgo)
  await syncProfile(userId)
  return await Promise.all(
    dateRange(daysAgo, oneWeekAgo).map(async date => {
      await syncMass(userId, date)
      await syncSleep(userId, date)
      await syncBodyFat(userId, date)
      await syncActivitySummary(userId, date)
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
  await Promise.all(userIds.map(userId => syncDayOneUser(userId, date)))
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
