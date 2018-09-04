/* @flow */
export const safeFirestoreInput = (rawInput: Object) =>
  Object.keys(rawInput).reduce(
    (acc, key) => ({ ...acc, ...(rawInput[key] !== undefined ? { [key]: rawInput[key] } : {}) }),
    {},
  )

export default safeFirestoreInput
