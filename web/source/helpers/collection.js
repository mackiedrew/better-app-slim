/* @flow */

export const reverse = <T>(array: Array<T>): Array<T> =>
  array.reduce((acc, entry) => [entry, ...acc], [])

export default reverse
