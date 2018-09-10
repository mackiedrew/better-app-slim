/* @flow */
import React, { Component } from "react"

import withLoggedIn from "../containers/withLoggedIn"

import MassChart from "../organisms/MassChart"
import DailyStats from "../organisms/DailyStats"
import FitbitActions from "../organisms/FitbitActions"

type Props = {
  uid: string | null,
  loggedIn: boolean,
}

class LoginPage extends Component<Props> {
  render() {
    return (
      <div>
        <MassChart />
        <FitbitActions />
        <DailyStats days={20} />
      </div>
    )
  }
}

export default withLoggedIn(LoginPage)
