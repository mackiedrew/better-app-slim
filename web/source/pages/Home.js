/* @flow */
import React, { Component, Fragment } from "react"

import withLoggedIn from "../containers/withLoggedIn"

import MassChart from "../organisms/MassChart"
import DailyStats from "../organisms/DailyStats"
import Section from "../templates/Section"

type Props = {
  uid: string | null,
  loggedIn: boolean,
}

class LoginPage extends Component<Props> {
  render() {
    return (
      <Fragment>
        <MassChart />
        <Section title="Month">
          <DailyStats days={30} />
        </Section>
      </Fragment>
    )
  }
}

export default withLoggedIn({ showLogin: true })(LoginPage)
