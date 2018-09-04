/* @flow */

import cron from "node-cron"

import { syncWeekWithoutResponse } from "./fitbit/request"

const onceEveryDayAt1AM = "0 1 * * *"

cron.schedule(onceEveryDayAt1AM, syncWeekWithoutResponse)
