/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import Column from "./templates/Column"
import Header from "./organisms/Header"
import Footer from "./organisms/Footer"

import Home from "./pages/Home"
import SingleDate from "./pages/SingleDate"

const StyledColumn = styled(Column)`
  align-items: stretch;
`

const Main = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-self: center;
  align-items: center;
  align-content: center;
  max-width: 50rem;
  width: 100%;
`

type Props = {}

export default class extends Component<Props> {
  static displayName = "Routes"
  render() {
    return (
      <StyledColumn>
        <Header>Better App</Header>
        <Main>
          <Router>
            <Switch>
              <Route
                path="/today"
                component={props => <SingleDate {...props} date={new Date()} />}
              />
              <Route path="/:year/:month/:day" component={SingleDate} />
              <Route path="/" component={Home} />
            </Switch>
          </Router>
        </Main>
        <Footer />
      </StyledColumn>
    )
  }
}
