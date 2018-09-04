/* @flow */

export type Grams = number
export type Kilograms = number
export type Meters = number
export type Kcal = number
export type Percentage = number

export type Gender = "MALE" | "FEMALE"

export opaque type Years = number
export opaque type Age = Years
export opaque type Mass = Kilograms
export opaque type Height = Meters
export opaque type BMR = Kcal

export opaque type Macros = {|
  protein: Grams,
  carbohydrates: Grams,
  lipids: Grams,
|}
