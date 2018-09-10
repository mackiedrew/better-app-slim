/* @flow */

export type Grams = number
export type Kilograms = number
export type Centimeters = number
export type Meters = number
export type Kcal = number
export type Percentage = number

export type Gender = "MALE" | "FEMALE"

export type Years = number
export type Age = Years
export type Mass = Kilograms
export type Height = Meters
export type BMR = Kcal

export type ActivityRegion =
  | "INACTIVE"
  | "SEDENTARY"
  | "LIGHT"
  | "MODERATE"
  | "VIGOROUS"
  | "EXTREME"
export type PhysicalActivityLevel = number

export type Macros = {|
  protein: Grams,
  carbohydrates: Grams,
  lipids: Grams,
|}
