/* @flow */
import App from "./app"

import { getFitbitAuthorizationUri, processFitbitCodeToTokens } from "./fitbit/authorization"
import { syncToday, syncDay, syncWeek } from "./fitbit/request"

App.get("/fitbit-auth-url", getFitbitAuthorizationUri)
App.get("/fitbit", processFitbitCodeToTokens)
App.get("/fitbit/sync", syncDay)
App.get("/fitbit/sync/1w", syncWeek)
App.get("/fitbit/sync/today", syncToday)
