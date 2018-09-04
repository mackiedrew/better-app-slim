/* @flow */
// Required to be first for Google Cloud Platform debugging service
if (process.env.NODE_ENV === "production") require("@google-cloud/debug-agent").start()

/* eslint-disable import/first */
import "@babel/polyfill"

import serviceAccount from "../.env/serviceAccountKey"
import fitbitEnv from "../.env/fitbitEnv"
/* eslint-enable import/first */

export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const IS_DEVELOPMENT = !IS_PRODUCTION
export const PORT = IS_DEVELOPMENT ? 3000 : process.env.PORT || 8080
export const FIREBASE_ADMIN = serviceAccount
export const FITBIT = fitbitEnv
