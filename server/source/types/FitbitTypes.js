/* @flow */
export type FitbitScopesType =
  | "activity"
  | "location"
  | "heartrate"
  | "nutrition"
  | "profile"
  | "settings"
  | "sleep"
  | "social"
  | "weight"

export type FitbitAuthorizationPageParamsType = {
  client_id: string,
  response_type: "code" | "token", // Use "code" for Authorization Code Grant Flow
  scope: string, // URI encode w/ spaces between
  redirect_uri: string,
  expires_in?: number, // defaults to 86400 for 1 day, 31536000 for 1 year
}

export type FitbitAccessTokenRequestType = {
  code: string,
  grant_type: "authorization_code",
  client_id: string,
}
