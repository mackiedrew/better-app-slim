/* @flow */

export const capitalizeFirstLetter = (value: string): string =>
  value.slice(0, 1).toUpperCase() + value.slice(1)

export const camelToTitle = (value: string): string =>
  value
    .split(/(?=[A-Z])/)
    .map(capitalizeFirstLetter)
    .join(" ")
