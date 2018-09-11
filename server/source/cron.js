/* @flow */

import cron from "node-cron"

import { syncWeekWithoutResponse, fullSync } from "./fitbit/request"

import { summarizeDateRange } from "./user/operations"

const onceEveryDayAt1AM = "0 1 * * *"

cron.schedule(onceEveryDayAt1AM, syncWeekWithoutResponse)

summarizeDateRange("r4XJfHyPlmSRs9mWbomikPikKLI2", new Date(2018, 7, 8), new Date(2018, 8, 10))

// fullSync("r4XJfHyPlmSRs9mWbomikPikKLI2")
// syncWeekWithoutResponse()
