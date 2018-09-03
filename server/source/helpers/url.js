/* @flow */

export const joinParams = (params: { [string]: any }) =>
  Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&")

export const addUrlParams = (baseUrl: string, params: { [string]: any }): string =>
  `${baseUrl}/?${joinParams(params)}`
