/* @flow */
export const toFixed = (value: number, decimals: number = 2): string => value.toFixed(decimals)

export const mRound = (value: number, factor: number = 1): number =>
  factor * Math.round(value / factor)
