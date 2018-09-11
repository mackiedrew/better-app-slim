/* @flow */
import type { Gender } from "./HealthTypes"

export type Nutrition = {|
  calories: number,
  carbs: number,
  fat: number,
  fiber: number,
  protein: number,
  sodium: number,
  water: number,
|}

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
  foods: {
    isFavorite: boolean,
    logDate: string,
    logId: number,
    loggedFood: {
      accessLevel: "PUBLIC" | "PRIVATE" | "SHARED",
      amount: number,
      brand: string,
      calories: number,
      foodId: number,
      mealTypeId: number,
      locale: string,
      name: string,
      unit: { id: number, name: string, plural: string },
      units: number[],
    },
    nutritionalValues: Nutrition,
  }[],
  nutrition: Nutrition,
  activities: Object[],
  activitySummary: Object,
|}

export type User = {|
  uid: string,
  summaries: Summary[],
|}
