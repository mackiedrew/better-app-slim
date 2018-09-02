/* @flow */
import path from "path"

import express from "express"

import { PORT } from "./env"

export const App = express()

App.set("trust proxy", true)
console.log(__dirname)
App.use(express.static(path.join(__dirname, "/../build/web")))
App.listen(PORT, () => console.log(`App listening on port ${PORT}!`))

export default App
