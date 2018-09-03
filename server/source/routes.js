/* @flow */
import App from "./app"

import { getFitbitAuthorizationUri, processFitbitCodeToTokens } from "./fitbit"

App.get("/test", (request, response) => response.send(request.query || "No Query!"))
App.get("/fitbit-auth-url", getFitbitAuthorizationUri)
App.get("/fitbit", processFitbitCodeToTokens)
