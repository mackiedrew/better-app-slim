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

import { getFatMass } from "./composition"

export const getMaxDeficit = (mass: Kilograms, bodyFat: Percentage) => {
  const kcalFrom1kgOfFat = 69
  const fatMass = getFatMass(mass, bodyFat)
  return fatMass
}

// export const getMinEnergy = (tdee, )