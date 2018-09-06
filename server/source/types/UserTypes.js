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
|}

export type User = {|
  uid: string,
  summaries: Summary[],
|}
