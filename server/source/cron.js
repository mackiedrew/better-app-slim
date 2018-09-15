/* @flow */

import cron from "node-cron"

import { syncWeekWithoutResponse } from "./fitbit/request"
// import { syncWeekWithoutResponse, fullSync } from "./fitbit/request"
// import { summarizeDateRange } from "./user/operations"

const everyHourOn5Min = "5 */1 * * *"
cron.schedule(everyHourOn5Min, syncWeekWithoutResponse)

// summarizeDateRange("r4XJfHyPlmSRs9mWbomikPikKLI2", new Date(2018, 7, 8), new Date(2018, 8, 10))
// syncWeekWithoutResponse()
// fullSync("r4XJfHyPlmSRs9mWbomikPikKLI2")
