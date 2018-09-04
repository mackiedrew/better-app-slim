/* @flow */

import type { ResourceTypes, FitbitUserId, EndpointOptions } from "../types/FitbitTypes"

import { dateToFitbitDate } from "../helpers/date"

export const baseUrl = "https://api.fitbit.com"
export const userEndPoint = `${baseUrl}/1/user`
export const userEndPoint2 = `${baseUrl}/1.2/user`

/* eslint-disable-next-line complexity */
export const createAccessOptions = (options: EndpointOptions) => {
  if (options.baseDate && options.endDate)
    return `/${dateToFitbitDate(options.baseDate)}/${dateToFitbitDate(options.endDate)}`
  if (options.date && options.period) return `/${dateToFitbitDate(options.date)}/${options.period}`
  if (options.date) return `/${dateToFitbitDate(options.date)}`
  return ""
}

export const endpoint = (fitbitUserId: FitbitUserId) => (apiVersion: "1" | "1.2") => (
  resource: ResourceTypes,
) => (options: EndpointOptions = {}) => {
  return `${baseUrl}/${apiVersion}/user/${fitbitUserId}/${resource}${createAccessOptions(
    options,
  )}.json`
}

export const bodyFat = (user: FitbitUserId) => endpoint(user)("1")("body/log/fat/date")
export const weight = (user: FitbitUserId) => endpoint(user)("1")("body/log/weight/date")
export const weightGoal = (user: FitbitUserId) => () =>
  endpoint(user)("1")("body/log/weight/goal")()
export const fatGoal = (user: FitbitUserId) => () => endpoint(user)("1")("body/log/fat/goal")()
export const heartrate = (user: FitbitUserId) => endpoint(user)("1")("activities/heart/date")
export const profile = (user: FitbitUserId) => () => endpoint(user)("1")("profile")()
export const sleep = (user: FitbitUserId) => endpoint(user)("1.2")("sleep/date")
export const foodGoal = (user: FitbitUserId) => () => endpoint(user)("1")("foods/log/goal")()
export const foodLog = (user: FitbitUserId) => endpoint(user)("1")("foods/log/date")
export const dailyActivity = (user: FitbitUserId) => endpoint(user)("1")("activities/date")

export default endpoint
