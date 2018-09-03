/* @flow */
import React, { Component } from "react"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import Home from "./pages/Home"

type Props = {}

export default class extends Component<Props> {
  static displayName = "Routes"
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    )
  }
}
