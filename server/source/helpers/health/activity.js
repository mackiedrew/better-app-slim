/* @flow */

import type {
  Kilograms,
  Centimeters,
  Years,
  Gender,
  Kcal,
  PhysicalActivityLevel,
  ActivityRegion,
} from "../../types/HealthTypes"

/* https://en.wikipedia.org/wiki/Harris%E2%80%93Benedict_equation */
export const getBmr = (gender: Gender) => (height: Centimeters) => (age: Years) => (
  mass: Kilograms,
): Kcal => {
  const genderConstant = gender === "FEMALE" ? -161 : 5
  const bmr = 10 * mass + 6.25 * height - 5 * age + genderConstant
  return bmr
}

/* https://en.wikipedia.org/wiki/Physical_activity_level */
export const estimatePalByRegion = (activityRegion: ActivityRegion): PhysicalActivityLevel =>
  ({
    INACTIVE: 1.1,
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    VIGOROUS: 2.725,
    EXTREME: 1.9,
  }[activityRegion])

export const getPal = (tdee: Kcal, bmr: Kcal): PhysicalActivityLevel => tdee / 24 / bmr

export const getTdee = (bmr: Kcal, pal: PhysicalActivityLevel): Kcal => bmr * pal
