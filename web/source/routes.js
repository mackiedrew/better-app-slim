/* @flow */
import React, { Component } from "react"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import Column from "./templates/Column"
import Header from "./organisms/Header"
import Footer from "./organisms/Footer"

import Home from "./pages/Home"
import SingleDate from "./pages/SingleDate"

type Props = {}

export default class extends Component<Props> {
  static displayName = "Routes"
  render() {
    return (
      <Column>
        <Header>Better App</Header>
        <main>
          <Router>
            <Switch>
              <Route path="/:year/:month/:day" component={SingleDate} />
              <Route path="/" component={Home} />
            </Switch>
          </Router>
        </main>
        <Footer />
      </Column>
    )
  }
}
