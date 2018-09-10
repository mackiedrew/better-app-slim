/* @flow */

export const getDailySummaries = async (
  firestore: any,
  uid: string,
  { days, latestDate }: { days: number, latestDate: Date },
) => {
  const endDate = new Date(latestDate.getFullYear(), latestDate.getMonth(), latestDate.getDate())
  const startDate = new Date(
    latestDate.getFullYear(),
    latestDate.getMonth(),
    latestDate.getDate() - days - 1,
  )
  const firstMillisecond = startDate.getTime() - 1
  const nextMillisecond = endDate.getTime() + 1
  const summariesSnapshot = await firestore
    .collection("users")
    .doc(uid)
    .collection("summaries")
    .orderBy("unixTimestamp", "desc")
    .where("unixTimestamp", ">=", firstMillisecond)
    .where("unixTimestamp", "<", nextMillisecond)
    .limit(days + 1)
    .get()
  const summaries = await Promise.all(summariesSnapshot.docs.map(async doc => doc.data()))
  return summaries
}

export default getDailySummaries
