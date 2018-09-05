/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"

import Section from "../templates/Section"
import Row from "../templates/Row"
import Button from "../atoms/Button"

type Props = {
  uid: string,
}

type State = {
  fitbitAuthUrl: string | null,
  response: string | null,
  error: string | null,
}

class FitbitActions extends Component<Props, State> {
  api = "https://api.betterapp.ca"
  state = { fitbitAuthUrl: null, response: null, error: null }
  async componentDidMount() {
    const response = await fetch(`${this.api}/fitbit-auth-url`)
    const url = await response.text()
    this.setState({ fitbitAuthUrl: url })
  }
  handleSyncDay = () =>
    fetch(`${this.api}/fitbit/sync/today`)
      .then(async response => await response.text())
      .then(response => this.setState({ response }))
      .catch(error => this.setState({ error }))
  handleSyncWeek = () =>
    fetch(`${this.api}/fitbit/sync/1w`)
      .then(async response => await response.text())
      .then(response => this.setState({ response }))
      .catch(error => this.setState({ error }))
  render() {
    const { response, error } = this.state
    const url = this.state.fitbitAuthUrl || ""
    const uid = this.props.uid || ""
    return (
      <Section title="Fitbit">
        <Row>
          <a href={`${url}&state=${uid}`}>Authorize</a>
          <Button onClick={this.handleSyncDay}>Sync Day</Button>
          <Button onClick={this.handleSyncWeek}>Sync Week</Button>
        </Row>
        {response && <p>{response}</p>}
        {error && <p>{error}</p>}
      </Section>
    )
  }
}

export default compose(connect(state => ({ uid: state.firebase.auth.uid })))(FitbitActions)
