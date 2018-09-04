/* @flow */

import type { $Request, $Response } from "express"
import fetch from "node-fetch"

import { FITBIT } from "../env"
import { fitbitUsersCollection } from "../firestore/collections"
import type { FitbitScopesType, FitbitAuthorizationPageParamsType } from "../types/FitbitTypes"

import { addUrlParams, joinParams } from "../helpers/url"

export const requestedScopes: FitbitScopesType[] = [
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

export const authorizationHeader = `Basic ${Buffer.from(
  `${FITBIT.clientId}:${FITBIT.clientSecret}`,
).toString("base64")}`

export const getFitbitAuthorizationUri = (request: $Request, response: $Response) => {
  const options: FitbitAuthorizationPageParamsType = {
    client_id: FITBIT.clientId,
    response_type: "code",
    scope: requestedScopes.join("%20"), // URI encode w/ spaces between
    redirect_uri: FITBIT.callbackUrl,
  }
  const fullAuthorizationUri = addUrlParams(FITBIT.authorizationUri, options)
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  response.send(fullAuthorizationUri)
}

export const processFitbitCodeToTokens = async (request: $Request, response: $Response) => {
  const { state: userId, code: fitbitCode } = request.query
  const fitbitUser = fitbitUsersCollection.doc(userId)
  await fitbitUser.set({ uid: userId, accessCode: fitbitCode }, { merge: true })
  const body = joinParams({
    code: fitbitCode,
    client_id: FITBIT.clientId,
    grant_type: "authorization_code",
    redirect_uri: FITBIT.callbackUrl,
    state: userId,
  })
  const fitbitResponse = await fetch(FITBIT.refreshTokenRequestUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authorizationHeader,
    },
    body,
  })
  const data = fitbitResponse.json()
  fitbitUser.update(
    {
      fitbitUserId: data.user_id,
      tokenType: data.token_type,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    },
    { merge: true },
  )

  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  response.send(`Fitbit Authorized!`)
}

export const refreshTokens = async (userId: string) => {
  const fitbitUser = fitbitUsersCollection.doc(userId)
  const refreshToken = (await fitbitUser.get()).data().refreshToken

  const response = await fetch(FITBIT.refreshTokenRequestUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authorizationHeader,
    },
    body: joinParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  })
  const data = await response.json()
  fitbitUser.update(
    {
      fitbitUserId: data.user_id,
      tokenType: data.token_type,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    },
    { merge: true },
  )
}
