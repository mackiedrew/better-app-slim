/* @flow */
import React, { Component } from "react"
import styled from "styled-components"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import moment from "moment"

import type { FirebaseType } from "../types/FirebaseType"

import PeriodicCell from "../molecules/PeriodicCell"
import Row from "../templates/Row"
import Section from "../templates/Section"

const StyledRow = styled(Row)`
  flex-wrap: wrap;
  justify-content: space-evenly
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
      .orderBy("unixTimestamp", "desc")
      .limit(21)
      .get()
    const bodyFatLogs = await this.props.firestore
      .collection("fitbit_users")
      .doc(this.props.uid)
      .collection("bodyFatLogs")
      .orderBy("unixTimestamp", "desc")
      .limit(21)
      .get()
    const massLogData = await Promise.all(massLogs.docs.map(async doc => doc.data()))
    const bodyFatLogsData = await Promise.all(bodyFatLogs.docs.map(async doc => doc.data()))
    this.setState({ massLogs: massLogData, bodyFatLogs: bodyFatLogsData })
  }
  render() {
    const { massLogs } = this.state
    return (
      <Section title="Summary">
        {massLogs.map(({ weight, logId, unixTimestamp }, index) => {
          const date = moment(unixTimestamp)
          const lastMassRecordIndex = Math.min(index + 1, massLogs.length - 1)
          const lastMassRecord = massLogs[lastMassRecordIndex]
          const lostMass = weight <= lastMassRecord.weight
          const massSentiment = lostMass ? "GOOD" : "BAD"
          return (
            <StyledRow key={`${logId}-${index}`}>
              <PeriodicCell label="date" unit={date.format("MMM")} value={date.format("DD")} />
              <PeriodicCell
                sentiment={massSentiment}
                range={{ min: 0.2, max: 0.5 }}
                label="mass"
                unit="kg"
                value={weight}
              />
              <PeriodicCell
                sentiment="MIXED"
                label="bodyFat"
                unit="%"
                value={this.state.bodyFatLogs[index].fat}
              />
            </StyledRow>
          )
        })}
      </Section>
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
