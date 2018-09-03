/* @flow */

export type FirebaseType = {
  login: ({ email: string, password: string }) => Promise<{}>,
  createUser: ({ email: string, password: string }) => Promise<{}>,
  logout: void => void,
  auth: {
    email?: string,
  } | null,
}
