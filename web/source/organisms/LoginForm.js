/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { withFirebase } from "react-redux-firebase"

import type { FirebaseType } from "../types/FirebaseType"

import Column from "../templates/Column"
import TextInput from "../molecules/TextInput"
import Button from "../atoms/Button"
import ErrorMessage from "../atoms/ErrorMessage"

type Props = {
  firebase: FirebaseType,
  isRegister?: boolean,
}

type State = {
  email: string,
  password: string,
  error: string | null,
}

class LoginForm extends Component<Props, State> {
  static defaultProps = {
    isRegister: false,
  }
  state = { email: "", password: "", error: null }
  handleValueChange = (key: string) => (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ [key]: event.target.value })
  handleEmailChange = this.handleValueChange("email")
  handlePasswordChange = this.handleValueChange("password")
  handleSubmit = () =>
    this.props.firebase[this.props.isRegister ? "createUser" : "login"]({
      email: this.state.email,
      password: this.state.password,
    }).catch(error => {
      this.setState({ error: error.message })
    })
  render() {
    const { error, password, email } = this.state
    return (
      <Column>
        <h1>{this.props.isRegister ? "Register" : "Login"}</h1>
        <TextInput label="Email" value={email} onChange={this.handleEmailChange} />
        <TextInput hidden label="Password" value={password} onChange={this.handlePasswordChange} />
        <Button onClick={this.handleSubmit}>Submit</Button>
        <ErrorMessage>{error ? error : ""}</ErrorMessage>
      </Column>
    )
  }
}

export default compose(withFirebase)(LoginForm)
