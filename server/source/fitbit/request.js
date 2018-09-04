/* @flow */
import fetch from "node-fetch"

import type { FitbitEndpoint, EndpointOptions } from "../types/FitbitTypes"

import { fitbitUsersCollection } from "../firestore/collections"

import { fitbitToRealDate } from "../helpers/date"

import { weight, profile, bodyFat, sleep, dailyActivity } from "./endpoints"
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
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization },
  })
  const data = await response.json()
  if (data.success === false) console.log(response.headers)
  return data
}

export const storeProfileInFirestore = async (userId: string) => {
  const fitbitResponse = await get(userId, profile)
  const user = fitbitResponse && fitbitResponse.user ? fitbitResponse.user : {}
  const fitbitUser = fitbitUsersCollection.doc(userId)
  fitbitUser.update({ profile: user }, { merge: true })
}

export const storeMassInFirestore = async () => {
  const userId = "r4XJfHyPlmSRs9mWbomikPikKLI2"
  const frames = [2014, 2015, 2016, 2017, 2018].reduce(
    (acc, year) => [...acc, ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => [year, month])],
    [],
  )
  const frameStarts = frames.map(([year, month]) => new Date(year, month, 1))
  frameStarts.forEach(async frameStart => {
    const data = (await get(userId, weight, { date: frameStart, period: "1m" })).weight
    const fitbitUser = fitbitUsersCollection.doc(userId)
    data.map(massLog => {
      fitbitUser
        .collection("massLogs")
        .doc(`${massLog.logId}`)
        .set(
          {
            logId: massLog.logId,
            bmi: massLog.bmi,
            dateTime: fitbitToRealDate(massLog.date, massLog.time),
            source: massLog.source,
            weight: massLog.weight,
          },
          { merge: true },
        )
    })
  })
}

export const storeBodyFatInFirestore = async () => {
  const userId = "r4XJfHyPlmSRs9mWbomikPikKLI2"
  const frames = [2014, 2015, 2016, 2017, 2018].reduce(
    (acc, year) => [...acc, ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => [year, month])],
    [],
  )
  const frameStarts = frames.map(([year, month]) => new Date(year, month, 1))
  frameStarts.forEach(async frameStart => {
    const data = (await get(userId, bodyFat, { date: frameStart, period: "1m" })).fat
    const fitbitUser = fitbitUsersCollection.doc(userId)
    data.map(log => {
      fitbitUser
        .collection("bodyFatLogs")
        .doc(`${log.logId}`)
        .set(
          {
            logId: log.logId,
            source: log.source,
            fat: log.fat,
            dateTime: fitbitToRealDate(log.date, log.time),
          },
          { merge: true },
        )
    })
  })
}

export const storeSleepInFirestore = async () => {
  const userId = "r4XJfHyPlmSRs9mWbomikPikKLI2"
  const dates = [...new Array(150)].map((_, i) => {
    const startDate = new Date(2014, 6, 1)
    return new Date(startDate.setDate(startDate.getDate() + i + 1))
  })
  dates.forEach(async date => {
    const data = (await get(userId, sleep, { date })).sleep
    const fitbitUser = fitbitUsersCollection.doc(userId)
    data.map(async log => {
      try {
        await fitbitUser
          .collection("sleepLogs")
          .doc(`${log.logId}`)
          .set(
            {
              ...log,
              startTime: new Date(log.startTime),
            },
            { merge: true },
          )
      } catch (error) {
        console.error(log.logId)
      }
    })
  })
}

export const syncActivity = async (userId: string, startDate: Date, days: number) => {
  const dates = [...new Array(1525)].map(
    (_, i) => new Date(startDate.setDate(startDate.getDate() + i + 1)),
  )
  dates.forEach(async date => {
    const data = await get(userId, dailyActivity, { date })
    const fitbitUser = fitbitUsersCollection.doc(userId)
    await fitbitUser
      .collection("activitySummary")
      .doc(`${date.toISOString()}`)
      .set(
        {
          ...data,
          date,
        },
        { merge: true },
      )
  })
}

// Sync the last week because it's possible that old data has been updated
export const syncUserLastWeek = async (userId: string) => {
  console.log(userId)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  await storeProfileInFirestore(userId)
  // Weight 1w
  // Fat 1w
  // Sleep 1d * 7
  // Activity Summary 1d * 7
}

export const syncAllUsersLastWeek = async () => {
  const querySnapshot = await fitbitUsersCollection.get()
  const docSnapshots = querySnapshot.docs
  const userIds = docSnapshots.map(({ id }) => id)
  userIds.forEach(syncUserLastWeek)
}

// syncAllUsersLastWeek()

export default get
