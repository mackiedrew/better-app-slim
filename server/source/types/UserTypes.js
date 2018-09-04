/* @flow */
import type { Mass, Height, Percentage, } from "../types/HealthTypes"

export type Summary = {|
  date: Date,
  lastUpdated: Date,
  goals: {
    mass: Mass,
    bodyFat: Percentage,
  },
  mass: Mass,
  height: Height,
  bodyFat: Percentage,
|}

export type User = {|
  uid: string,
  summaries: Summary[],
|}
