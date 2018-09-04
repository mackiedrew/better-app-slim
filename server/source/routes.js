/* @flow */
import path from "path"

import App from "./app"

import { getFitbitAuthorizationUri, processFitbitCodeToTokens } from "./fitbit/authorization"

App.get("/web/*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "../build/web", "index.html"))
})
App.get("/fitbit-auth-url", getFitbitAuthorizationUri)
App.get("/fitbit", processFitbitCodeToTokens)
