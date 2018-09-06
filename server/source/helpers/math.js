/* @flow */

export const add = (values: number[]) => values.reduce((sum, value) => sum + value, 0)
export const average = (values: number[]) => add(values) / values.length

export const exploreValues = (values: number[]) => {
  if (values.length === 0) return { min: null, max: null, mean: null, values }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const mean = average(values)
  return { min, max, mean, values }
}

export default exploreValues
