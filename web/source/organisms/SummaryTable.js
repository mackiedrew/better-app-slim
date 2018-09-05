/* @flow */
import React, { Component } from "react"
import styled from "styled-components"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import type { FirebaseType } from "../types/FirebaseType"
import { fireStoreDateToDate } from "../helpers/date"

import Cell from "../templates/Cell"
import Row from "../templates/Row"
import Column from "../templates/Column"

const StyledRow = styled(Row)`
  background-color: #dddddd;
  margin-bottom: 0.5rem;
`

type Props = {
  firebase: FirebaseType,
  firestore: any,
  uid: string,
}

type State = {
  massLogs: Object[],
  bodyFatLogs: Object[],
}

class SummaryTable extends Component<Props, State> {
  static defaultProps = {}
  state = { massLogs: [], bodyFatLogs: [] }
  async componentDidMount() {
    const massLogs = await this.props.firestore
      .collection("fitbit_users")
      .doc(this.props.uid)
      .collection("massLogs")
      .orderBy("dateTime", "desc")
      .limit(50)
      .get()
    const bodyFatLogs = await this.props.firestore
      .collection("fitbit_users")
      .doc(this.props.uid)
      .collection("bodyFatLogs")
      .orderBy("dateTime", "desc")
      .limit(50)
      .get()
    const massLogData = await Promise.all(massLogs.docs.map(async doc => doc.data()))
    const bodyFatLogsData = await Promise.all(bodyFatLogs.docs.map(async doc => doc.data()))
    this.setState({ massLogs: massLogData, bodyFatLogs: bodyFatLogsData })
  }
  render() {
    return (
      <Column>
        {this.state.massLogs.map(({ weight, logId, dateTime }, index) => (
          <StyledRow key={`${logId}-${index}`}>
            <Cell>Date: {fireStoreDateToDate(dateTime).toDateString()}</Cell>
            <Cell>Mass: {weight}</Cell>
            <Cell>BF%: {this.state.bodyFatLogs[index].fat}</Cell>
          </StyledRow>
        ))}
      </Column>
    )
  }
}

export default compose(
  withFirebase,
  firestoreConnect(),
  connect(state => ({
    uid: state.firebase.auth.uid,
    email: state.firebase.auth.isEmpty ? "No email!" : state.firebase.auth.email,
  })),
)(SummaryTable)
