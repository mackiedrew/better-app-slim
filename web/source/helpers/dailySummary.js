/* @flow */

import moment from "moment"

export const getDailySummaries = async (
  firestore: any,
  uid: string,
  { days, latestDate }: { days: number, latestDate: Date },
) => {
  const endDate = new Date(latestDate.getFullYear(), latestDate.getMonth(), latestDate.getDate())
  const startDate = new Date(
    latestDate.getFullYear(),
    latestDate.getMonth(),
    latestDate.getDate() - days - 1,
  )
  const firstMillisecond = startDate.getTime() - 1
  const nextMillisecond = endDate.getTime() + 1
  const summariesSnapshot = await firestore
    .collection("users")
    .doc(uid)
    .collection("summaries")
    .orderBy("unixTimestamp", "desc")
    .where("unixTimestamp", ">=", firstMillisecond)
    .where("unixTimestamp", "<", nextMillisecond)
    .limit(days + 1)
    .get()
  const summaries = await Promise.all(summariesSnapshot.docs.map(async doc => doc.data()))
  return summaries
}

const getRelativeRange = (mean, min, max) => ({
  min: Math.abs(min - mean),
  max: Math.abs(max - mean),
})

export const summarizeDate = ({ unixTimestamp }: Object) => {
  const date = moment(unixTimestamp)
  return { label: "date", unit: date.format("MMM"), value: date.format("DD") }
}

export const summarizeHeartrate = (
  { activitySummary }: Object,
  { activitySummary: previousActivitySummary }: Object,
) => {
  const lessThanYesterday =
    previousActivitySummary.restingHeartRate - activitySummary.restingHeartRate >= 0
  return {
    label: "hr",
    unit: "bpm",
    value: activitySummary ? activitySummary.restingHeartRate : "?",
    sentiment: lessThanYesterday ? "GOOD" : "BAD",
    decimals: 0,
  }
}

export const summarizeBurnt = ({ activitySummary, goals }: Object) => {
  const { caloriesOut } = activitySummary || {}
  const { caloriesOut: caloriesOutGoal } = goals || {}
  return {
    label: "burnt",
    unit: "kcal",
    value: `${caloriesOut - caloriesOutGoal >= 0 ? "+" : "-"}${Math.abs(
      caloriesOut - caloriesOutGoal,
    )}`,
    sentiment: caloriesOut - caloriesOutGoal >= 0 ? "GOOD" : "BAD",
  }
}

export const summarizeSteps = ({ activitySummary, goals }: Object) => {
  const { steps } = activitySummary || {}
  const { steps: stepsGoal } = goals || {}
  const stepDifference = steps - stepsGoal
  return {
    label: "steps",
    unit: "steps",
    value: `${stepDifference >= 0 ? "+" : "-"}${Math.abs(stepDifference)}`,
    sentiment: stepDifference >= 0 ? "GOOD" : "BAD",
  }
}

export const summarizeMass = ({ mass }: Object, { mass: previousMass }: Object) => {
  const change = mass.mean - previousMass.mean
  return {
    label: "mass",
    unit: "kg",
    range: getRelativeRange(mass.mean, mass.min, mass.max),
    value: `${change >= 0 ? "+" : "-"}${Math.abs(change).toFixed(1)}`,
    sentiment: change <= 0 ? "GOOD" : "BAD",
  }
}

export const summarizeBodyFat = ({ bodyFat }: Object, { bodyFat: previousBodyFat }: Object) => {
  const change = bodyFat.mean - previousBodyFat.mean
  return {
    label: "bodyFat",
    unit: "%",
    range: getRelativeRange(bodyFat.mean, bodyFat.min, bodyFat.max),
    value: `${change >= 0 ? "+" : "-"}${Math.abs(change).toFixed(1)}`,
    sentiment: change <= 0 ? "GOOD" : "BAD",
  }
}

export const summaryToTable = (summary: Object, previousSummary: Object) => {
  const cells = [
    summarizeDate(summary),
    summarizeHeartrate(summary, previousSummary),
    summarizeSteps(summary),
    summarizeBurnt(summary),
    summarizeMass(summary, previousSummary),
    summarizeBodyFat(summary, previousSummary),
  ]
  return cells
}

export const summariesToTable = (summaries: Array<Object>): Array<Array<Object>> => {
  if (summaries.length < 2) return []
  return summaries
    .slice(0, -1)
    .map((summary: Object, index: number) => summaryToTable(summary, summaries[index + 1]))
}
