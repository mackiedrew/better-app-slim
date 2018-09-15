/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { withFirebase } from "react-redux-firebase"

import { reduxForm } from "redux-form"

import type { FirebaseType } from "../types/FirebaseType"
import Input from "../molecules/form/Input"
import Form from "../molecules/Form"
import SubmitButton from "../molecules/form/SubmitButton"

type Props = {
  firebase: FirebaseType,
  handleSubmit: Function,
}

class LoginForm extends Component<Props> {
  handleLogin = values =>
    this.props.firebase.login({
      email: values.email,
      password: values.password,
    })
  render() {
    return (
      <Form title="Login" onSubmit={this.props.handleSubmit}>
        <Input label="Email" name="email" component="input" type="email" />
        <Input label="Password" name="password" component="input" type="password" />
        <SubmitButton>Login</SubmitButton>
      </Form>
    )
  }
}

export default compose(
  withFirebase,
  reduxForm({ form: "login" }),
)(LoginForm)
