/* @flow */
export const safeFirestoreInput = (rawInput: Object) =>
  Object.keys(rawInput).reduce(
    (acc, key) => ({ ...acc, ...(rawInput[key] !== undefined ? { [key]: rawInput[key] } : {}) }),
    {},
  )

export const queryForDate = (firestoreCollection: Object, date: Date) => {
  const firstMsOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const firstMsOfNextDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  ).getTime()

  return firestoreCollection
    .orderBy("unixTimestamp", "desc")
    .where("unixTimestamp", ">=", firstMsOfDate)
    .where("unixTimestamp", "<", firstMsOfNextDate)
}

export const resolveDoc = async (query: Object) => {
  const doc = await query.get()
  const data = await doc.data()
  return data
}

export const resolveDocs = async (query: Object) => {
  const docs = await query.get()
  let data = []
  docs.forEach(doc => {
    data = [...data, doc.data()]
  })
  return data
}

export default safeFirestoreInput
