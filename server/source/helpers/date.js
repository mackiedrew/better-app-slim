/* @flow */
import type { FitbitDate, FitbitTime } from "../types/FitbitTypes"

export const fitbitToRealDate = (date: FitbitDate, time: FitbitTime) => {
  const splitDate = date.split("-").map(parseFloat)
  const splitTime = time.split(":").map(parseFloat)
  return new Date(
    splitDate[0],
    splitDate[1] - 1,
    splitDate[2],
    splitTime[0],
    splitTime[1],
    splitTime[2],
  )
}

export const dateToFitbitDate = (date: Date): FitbitDate => date.toISOString().split("T")[0]
export const dateToFitbitTime = (date: Date): FitbitTime => date.toISOString().split("T")[1]

export const getMonthsBetween = (startDate: Date, endDate: Date): Date[] => {
  if (startDate > endDate) return []
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()
  const totalYears: number = endYear - startYear
  /* eslint-disable-next-line id-length */
  const yearRange: number[] = [...new Array(totalYears + 1)].map((_, index) => index + startYear)
  const monthRange: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  type Year = number
  type Month = number
  const yearMonthPairs: [Year, Month][] = yearRange.reduce(
    (acc, year) => [...acc, ...monthRange.map(month => [year, month])],
    [],
  )
  const months = yearMonthPairs.map(([year, month]) => new Date(year, month, 1))
  return months
}

export const getPastDate = (daysAgo: number, startDate: Date = new Date()) => {
  const pastDate = new Date(startDate)
  pastDate.setDate(startDate.getDate() - daysAgo)
  return pastDate
}

export const dateRange = (days: number, startDate: Date) =>
  [...new Array(days + 1)].map(() => new Date(startDate.setDate(startDate.getDate() + 1)))
