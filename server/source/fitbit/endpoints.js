/* @flow */

import type {
  ResourceTypes,
  FitbitUserId,
  FitbitDate,
  EndpointOptions,
  FitbitTime,
} from "../types/FitbitTypes"

import { baseUrl } from "./constants"

export const userEndPoint = `${baseUrl}/1/user`
export const userEndPoint2 = `${baseUrl}/1.2/user`

export const getFitbitDate = (date: Date): FitbitDate => date.toISOString().split("T")[0]
export const getFitbitTime = (date: Date): FitbitTime => date.toISOString().split("T")[1]

export const basicEndpoint = (resource: ResourceTypes, version: number = 1) => (
  fitbitUserId: FitbitUserId,
  extra?: string = "",
) => `${version === 1 ? userEndPoint : userEndPoint2}/${fitbitUserId}/${resource}${extra}.json`

/* eslint-disable-next-line complexity */
export const createAccessOptions = (options: EndpointOptions) => {
  if (options.baseDate && options.endDate)
    return `/${getFitbitDate(options.baseDate)}/${getFitbitDate(options.endDate)}`
  if (options.date && options.period) return `/${getFitbitDate(options.date)}/${options.period}`
  if (options.date) return `/${getFitbitDate(options.date)}`
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
