/* @flow */
import React from "react"
import { connect } from "react-redux"

import LoginForm from "../organisms/LoginForm"

const withLoggedIn = (ChildComponent: any) =>
  connect(state => ({
    loggedIn: Boolean(!state.firebase.auth.isEmpty),
    uid: state.firebase.auth.uid,
  }))(props => (props.loggedIn ? <ChildComponent {...props} /> : <LoginForm {...props} />))

export default withLoggedIn
