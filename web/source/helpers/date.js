/* @flow */

export const fireStoreDateToDate = (fireStoreDate: { seconds: number } = { seconds: 0 }) =>
  new Date(fireStoreDate.seconds * 1000)

export default fireStoreDateToDate
