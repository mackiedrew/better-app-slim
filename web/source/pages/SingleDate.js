/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"

import LoginForm from "../organisms/LoginForm"
import Section from "../templates/Section"

type Props = {
  uid: string | null,
  loggedIn: boolean,
  params: {|
    year: string,
    month: string,
    day: string,
  |},
}

class SingleDate extends Component<Props> {
  render() {
    console.log(this.props)
    const { loggedIn } = this.props
    if (!loggedIn) return <LoginForm />
    return (
      <Section title={"Daily Survey"}>
        <strong>lol</strong>
      </Section>
    )
  }
}

export default compose(
  connect(state => ({
    loggedIn: Boolean(!state.firebase.auth.isEmpty),
    uid: state.firebase.auth.uid,
  })),
)(SingleDate)
