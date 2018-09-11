/* @flow */

import type { Kilograms, Centimeters, Meters } from "../../types/HealthTypes"

export const cmToM = (cm: Centimeters): Meters => cm / 100
export const cmToInch = (cm: Centimeters): number => cm * 0.393701

export const getBmi = (mass: Kilograms, height: Centimeters): number => mass / cmToM(height) ** 2

export const getMassAtBmi = (bmi: number, height: Centimeters): number => bmi * cmToM(height) ** 2

export const getNewBmi = (mass: Kilograms, height: Centimeters): number =>
  (mass / cmToM(height) ** 2.5) * 1.3

export const getMassAtNewBmi = (bmi: number, height: Centimeters): number =>
  (bmi * cmToM(height) ** 2.5) / 1.3

export const idealMassRobinson = (height: Centimeters): Kilograms =>
  52 + 1.9 * (cmToInch(height) - 60)

export const idealMassMiller = (height: Centimeters): Kilograms =>
  56.2 + 1.41 * (cmToInch(height) - 60)

export const idealMassDevine = (height: Centimeters): Kilograms =>
  50 + 2.3 * (cmToInch(height) - 60)

export const idealMassHamwi = (height: Centimeters): Kilograms => 48 + 2.7 * (cmToInch(height) - 60)

export const idealMassWeightWatchers = (height: Centimeters): Kilograms => 23 * cmToM(height) ** 2

export const idealMassPeoplesChoice = (height: Centimeters): Kilograms => 22.5 * cmToM(height) ** 2

export const idealMassByBmi = (height: Centimeters): Kilograms => getMassAtBmi(21.75, height)

export const idealMassByNewBmi = (height: Centimeters): Kilograms => getMassAtNewBmi(21.75, height)

export const getIdealMasses = (height: Centimeters): { [string]: Kilograms } => ({
  robinson: idealMassRobinson(height),
  miller: idealMassMiller(height),
  devine: idealMassDevine(height),
  hamwi: idealMassHamwi(height),
  weightWatcher: idealMassWeightWatchers(height),
  peoplesChoice: idealMassPeoplesChoice(height),
  bmi: idealMassByBmi(height),
  newBmi: idealMassByNewBmi(height),
})
