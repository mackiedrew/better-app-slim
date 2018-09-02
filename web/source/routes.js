/* @flow */
import React, { Component } from "react"

import { BrowserRouter as Router, Route } from "react-router-dom"

type Props = {}

export default class extends Component<Props> {
  static displayName = "Routes"
  render() {
    return (
      <Router>
        <Route exact path="/" component={() => <b>Home</b>} />
      </Router>
    )
  }
}
