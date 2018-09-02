/* @flow */
import express from "express"

import "./cron"
import "./firestore"
import "./fitbit"

require("@google-cloud/debug-agent").start()

const PORT = 8080

const App = express()
App.set("trust proxy", true)
App.get("/", (request, response) => response.send(request.query || "No Query!"))
App.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
