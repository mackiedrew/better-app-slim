/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"

import SummaryTable from "../organisms/SummaryTable"
import LoginForm from "../organisms/LoginForm"
import FitbitActions from "../organisms/FitbitActions"

type Props = {
  uid: string | null,
  loggedIn: boolean,
}

class LoginPage extends Component<Props> {
  render() {
    return (
      <div>
        {!this.props.loggedIn ? <LoginForm /> : null}
        {this.props.loggedIn ? <FitbitActions /> : null}
        {this.props.loggedIn ? <SummaryTable /> : null}
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
