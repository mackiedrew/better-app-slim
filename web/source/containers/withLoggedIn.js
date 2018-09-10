/* @flow */
import React from "react"
import { connect } from "react-redux"

import LoginForm from "../organisms/LoginForm"

const withLoggedIn = ({ showLogin = false }: { showLogin: boolean }) => (ChildComponent: any) =>
  connect(state => ({
    loggedIn: Boolean(!state.firebase.auth.isEmpty),
    uid: state.firebase.auth.uid,
  }))(
    props =>
      props.loggedIn ? <ChildComponent {...props} /> : showLogin ? <LoginForm {...props} /> : null,
  )

export default withLoggedIn
