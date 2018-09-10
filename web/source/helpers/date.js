/* @flow */

export const toUnixTime = (date: Date): number => Math.round(date.getTime() / 1000)

export const getStartAndEndTimes = (date: Date): [Date, Date] => {
  const year = date.getFullYear()
  const month = date.getMonth() - 1
  const day = date.getDate()
  const startDateTime = new Date(year, month, day, 0, 0, 0)
  const endDateTime = new Date(year, month, day, 23, 59, 59)
  return [startDateTime, endDateTime]
}

export const getUnixStartAndEndTimes = (date: Date): [number, number] => {
  const startAndEndTimes = getStartAndEndTimes(date)
  return [toUnixTime(startAndEndTimes[0]), toUnixTime(startAndEndTimes[1])]
}

export const fireStoreDateToDate = (fireStoreDate: { seconds: number } = { seconds: 0 }) =>
  new Date(fireStoreDate.seconds * 1000)
