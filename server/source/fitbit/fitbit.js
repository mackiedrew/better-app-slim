/* @flow */

import type { $Request, $Response, $Next } from "express"

import fetch from "node-fetch"

import { FITBIT } from "../env"

import { fitbitUsersCollection } from "../firestore/collections"

import type { FitbitScopesType, FitbitAuthorizationPageParamsType } from "../types/FitbitTypes"

import { addUrlParams, joinParams } from "../helpers/url"

/**
 * https://dev.fitbit.com/build/reference/web-api/oauth2/#authorization-page
 *
 * The Authorization Code Grant Flow has the following steps:
 *  1. Your application redirects the user to Fitbit's authorization page. See Authorization Page below.
 *  2. Upon user consent, Fitbit redirects the user back to your application's redirect URL with an authorization code as a URL parameter.
 *  3. Your application exchanges the authorization code for an access token and refresh token. See Access Token Request below.
 *  4. Your application stores the access token and refresh token. It will use the access token to make requests to the Fitbit API. It will use the refresh token to obtain a new access token when the access token expires without having to re-prompt the user.
 */

/* eslint-disable-next-line import/prefer-default-export */
export const getFitbitAuthorizationUri = (request: $Request, response: $Response, next: $Next) => {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  const scope: FitbitScopesType[] = [
    "activity",
    "location",
    "heartrate",
    "nutrition",
    "profile",
    "settings",
    "sleep",
    "social",
    "weight",
  ]
  const options: FitbitAuthorizationPageParamsType = {
    client_id: FITBIT.clientId,
    response_type: "code",
    scope: scope.join("%20"), // URI encode w/ spaces between
    redirect_uri: FITBIT.callbackUrl,
    expires_in: 60 /* sec */ * 60 /* min */ * 24 /* hours */ * 365 /* days */ * 1 /* years */,
  }
  const fullAuthorizationUri = addUrlParams(FITBIT.authorizationUri, options)
  response.send(fullAuthorizationUri)
  next()
}

export const processFitbitCodeToTokens = (request: $Request, response: $Response) => {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  console.log("Processing tokens started...")
  const fitbitCode = request.query.code
  const userId = request.query.state
  console.log("Fitbit Code:", fitbitCode)
  console.log("User ID:", userId)
  const fitbitUser = fitbitUsersCollection.doc(userId)
  fitbitUser
    .set(
      {
        uid: userId,
        accessCode: fitbitCode,
      },
      { merge: true },
    )
    .then(() => {
      console.log("Wrote initial Fitbit User")
      const Authorization = `Basic ${Buffer.from(
        `${FITBIT.clientId}:${FITBIT.clientSecret}`,
      ).toString("base64")}`
      const body = joinParams({
        code: fitbitCode,
        client_id: FITBIT.clientId,
        grant_type: "authorization_code",
        redirect_uri: FITBIT.callbackUrl,
        state: userId,
      })
      console.log("Auth Body:", body)
      return fetch(FITBIT.refreshTokenRequestUri, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization,
        },
        body,
      })
        .then(res => res.json())
        .then(data => {
          console.log("Got Response!", JSON.stringify(data, null, 2))
          fitbitUser.set(
            {
              fitbitUserId: data.user_id,
              tokenType: data.token_type,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresIn: data.expires_in,
            },
            { merge: true },
          )
          return response.send(`Complete!`)
        })
        .catch(console.error)
    })
    .catch(console.error)
}

export const refreshTokens = () => {}

// TODO: Account synchronization through API data access
