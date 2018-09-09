/* @flow */

import cron from "node-cron"

import { syncWeekWithoutResponse } from "./fitbit/request"

import { summarizeDateRange } from "./user/operations"

const onceEveryDayAt1AM = "0 1 * * *"

cron.schedule(onceEveryDayAt1AM, syncWeekWithoutResponse)

summarizeDateRange("r4XJfHyPlmSRs9mWbomikPikKLI2", new Date(2018, 8, 7), new Date())

// fullSync("r4XJfHyPlmSRs9mWbomikPikKLI2")
// syncWeekWithoutResponse()
