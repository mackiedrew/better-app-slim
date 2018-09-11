/* @flow */

import type { Kilograms, Kcal, Percentage } from "../../types/HealthTypes"

import { getFatMass } from "./composition"

export const getMaxDeficit = (mass: Kilograms, bodyFat: Percentage): Kcal => {
  const kcalFrom1kgOfFat = 69 // kcal / kg
  const fatMass = getFatMass(mass, bodyFat)
  return fatMass * kcalFrom1kgOfFat
}

export default getMaxDeficit
