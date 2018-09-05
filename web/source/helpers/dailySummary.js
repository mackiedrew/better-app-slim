/* @flow */
import { getUnixStartAndEndTimes } from "./date"

export const getByDateFilter = (firestoreCollection: Object, dateKey: string, date: Date) => {
  const [start, end] = getUnixStartAndEndTimes(date)
  const takeFromPreviousDay = 1 * 60 * 60 /* hours */
  const takeFromNextDay = 6 * 60 * 60 /* hours */
  return firestoreCollection
    .where(dateKey, ">", start - takeFromPreviousDay)
    .where(dateKey, "<", end + takeFromNextDay)
}

export const fetchDocs = async (query: Object) => {
  const resolvedQuery = await query.get()
  const docs = resolvedQuery.docs
  const resolvedDocs = docs.map(async doc => doc.data())
  const allDocs = await Promise.all(resolvedDocs)
  return allDocs
}

export const getLogsFromDay = async (firestore: Object, uid: string, date: Date) => {
  const user = firestore.collection("fitbit_users").doc(uid)

  const massLogsCollection = user.collection("massLogs") // dateTime
  const bodyFatLogsCollection = user.collection("bodyFatLogs") // dateTime
  const activitySummaryCollection = user.collection("activitySummary") // date
  const sleepLogsCollection = user.collection("sleepLogs") // startDate

  const massLogs = await fetchDocs(getByDateFilter(massLogsCollection, "dateTime", date))
  const bodyFatLogs = await fetchDocs(getByDateFilter(bodyFatLogsCollection, "dateTime", date))
  const activitySummary = await fetchDocs(getByDateFilter(activitySummaryCollection, "date", date))
  const sleepLogs = await fetchDocs(getByDateFilter(sleepLogsCollection, "startDate", date))

  const logsFromDay = { massLogs, bodyFatLogs, activitySummary, sleepLogs }
  return logsFromDay
}
