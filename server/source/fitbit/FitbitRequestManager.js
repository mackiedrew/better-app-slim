// /* @flow */

// export const get = async (
//   userId: string,
//   endpointCallback: FitbitEndpoint,
//   options: EndpointOptions = {},
// ): Promise<{} | void> => {
//   await refreshTokens(userId)
//   const fitbitUser = fitbitUsersCollection.doc(userId)
//   // Get accessToken & refresh token from user
//   let fitbitUserData
//   try {
//     fitbitUserData = (await fitbitUser.get()).data()
//   } catch (error) {
//     console.error(error)
//     return {}
//   }
//   // Construct query
//   const Authorization = `Bearer ${fitbitUserData.accessToken}`
//   const endpoint = endpointCallback(fitbitUserData.fitbitUserId)(options)
//   console.log(`Calling: ${endpoint}`)
//   const response = await fetch(endpoint, { method: "GET", headers: { Authorization } })
//   const headers = response.headers
//   const apiHealth = {
//     remaining: headers.get("fitbit-rate-limit-remaining"),
//     limit: headers.get("fitbit-rate-limit-limit"),
//     reset: headers.get("fitbit-rate-limit-reset"),
//   }
//   console.log(
//     `Remaining calls this hour: ${apiHealth.remaining} / ${apiHealth.limit} for another ${Math.ceil(
//       apiHealth.reset / 60,
//     )}min`,
//   )
//   const data = await response.json()
//   if (data.success === false) console.log(response.headers)
//   return data
// }

// type Options = {}
// type FitbitRequest = {}
// type Health = {|
//   remaining: number,
//   limit: number,
//   reset: number,
// |}

// const DEFAULT_API_LIMIT: number = 150

// export default class FitbitRequestManager {
//   options: Options = {}
//   apiHealth: Health = {
//     remaining: DEFAULT_API_LIMIT,
//     limit: DEFAULT_API_LIMIT,
//     reset: 0,
//   }
//   requestQueue: FitbitRequest[] = []
//   constructor(options: Options) {
//     this.options = options
//   }
//   setQueue = (queue: FitbitRequest[]) => {
//     this.requestQueue = queue
//   }
//   addRequest = (request: FitbitRequest) => this.setQueue([...this.requestQueue, request])
//   clearRequests = () => this.setQueue([])
//   canMakeAnotherRequest = () => true
//   processRequests = async () => {
//     let previousResponse

//     for (requests in this.requestQueue) {
//       if (!this.canMakeAnotherRequest()) break
//     }
//   }
//   refreshTokens = () => {}
// }
