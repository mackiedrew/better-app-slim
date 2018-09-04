/* @flow */

import express from "express"

import { PORT } from "./env"

export const App = express()

App.set("trust proxy", true)
App.listen(PORT, () => console.log(`App listening on port ${PORT}`))

export default App
