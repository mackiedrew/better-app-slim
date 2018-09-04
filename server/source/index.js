/* @flow */

import "@babel/polyfill"

import { IS_PRODUCTION } from "./env"
import "./fitbit/request"

// Required to be first for Google Cloud Platform debugging service
if (IS_PRODUCTION) require("@google-cloud/debug-agent").start()

/* eslint-disable import/first */
import "./app"
import "./routes"
import "./cron"
/* eslint-enable import/first */
