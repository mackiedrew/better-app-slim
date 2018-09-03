/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase } from "react-redux-firebase"

import type { FirebaseType } from "../types/FirebaseType"

import Row from "../templates/Row"
import Button from "../atoms/Button"

type Props = {
  firebase: FirebaseType,
  email: string,
}

class LoginForm extends Component<Props> {
  static defaultProps = {}
  render() {
    const { firebase, email } = this.props
    return (
      <Row>
        <span>{email}</span>
        <Button onClick={firebase.logout}>Logout</Button>
      </Row>
    )
  }
}

export default compose(
  withFirebase,
  connect(state => ({
    email: state.firebase.auth.isEmpty ? "No email!" : state.firebase.auth.email,
  })),
)(LoginForm)
