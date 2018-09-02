/* @flow */

import type { $Request, $Response } from "express"

/**
 * This file should contain any interface to the FitBit API including authentication and data access.
 */
/* eslint-disable-next-line import/prefer-default-export */
export const fitbitAuthentication = (request: $Request, response: $Response): void => {
  response.send("Test!")
}

// TODO: Account synchronization through API data access
