/* @flow */

import serviceAccount from "../serviceAccountKey"

export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const IS_DEVELOPMENT = !IS_PRODUCTION
export const PORT = IS_DEVELOPMENT ? 3000 : 8080
export const FIREBASE_ADMIN = serviceAccount
