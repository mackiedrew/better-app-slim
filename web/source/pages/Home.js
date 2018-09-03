/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"

import UserActions from "../organisms/UserActions"
import LoginForm from "../organisms/LoginForm"

type Props = {
  uid: string | null,
  loggedIn: boolean,
}

type State = {
  url: string | null,
}

class LoginPage extends Component<Props, State> {
  state = { url: null, uid: null }
  componentDidMount() {
    fetch("https://better-app-4321.appspot.com/fitbit-auth-url")
      .then(response => response.text().then(url => this.setState({ url })))
      .catch(console.error)
  }
  render() {
    const url = this.state.url || ""
    const uid = this.props.uid || ""

    return (
      <div>
        {this.props.loggedIn ? <UserActions /> : <LoginForm />}
        {uid ? <a href={`${url}&state=${uid}`}>Authorize Better With Fitbit</a> : null}
      </div>
    )
  }
}

export default compose(
  connect(state => ({
    loggedIn: Boolean(!state.firebase.auth.isEmpty),
    uid: state.firebase.auth.uid,
  })),
)(LoginPage)
