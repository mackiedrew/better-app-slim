/* @flow */

import type { Kilograms, Percentage } from "../../types/HealthTypes"

export const ensurePercentage = (value: number): Percentage => (value > 1 ? value / 100 : value)

export const getFatMass = (mass: Kilograms, bodyFat: Percentage): Kilograms =>
  mass * ensurePercentage(bodyFat)

export const getLeanMass = (mass: Kilograms, bodyFat: Percentage): Kilograms =>
  mass * (1 - ensurePercentage(bodyFat))
