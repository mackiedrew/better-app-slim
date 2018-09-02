// @flow

declare module "firebase-admin" {
  declare type Admin = {
    initializeApp: ({ credential: Object }) => void,
    firestore: () => {},
    credential: () => {},
  }

  declare export default Admin
}
