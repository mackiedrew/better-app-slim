/* @flow */
import App from "./app"

import { fitbitAuthentication } from "./fitbit"

App.get("/test", (request, response) => response.send(request.query || "No Query!"))
App.get("/fitbit", fitbitAuthentication)
