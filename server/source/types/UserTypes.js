/* @flow */
import type { Gender } from "./HealthTypes"

export type Summary = {|
  date: Date,
  dateString: string, // "YYYY-MM-DD"
  timeString: string, // "HH-MM-SS"
  dateTimeString: string, // "YYYY-MM-DD-HH-MM-SS"
  unixTimestamp: number,
  mass: {|
    min: number | null,
    max: number | null,
    mean: number | null,
    values: number[],
  |},
  bodyFat: {|
    min: number | null,
    max: number | null,
    mean: number | null,
    values: number[],
  |},
  height: number,
  age: number,
  gender: Gender,
  goals: {
    activityMinutes: number,
    caloriesOut: number,
    distance: number,
    floors: number,
    steps: number,
  },
  activities: Object[],
  activitySummary: Object,
|}

export type User = {|
  uid: string,
  summaries: Summary[],
|}
