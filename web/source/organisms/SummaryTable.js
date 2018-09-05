/* @flow */
import React, { Component } from "react"
import styled from "styled-components"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import moment from "moment"

import type { FirebaseType } from "../types/FirebaseType"
import { fireStoreDateToDate } from "../helpers/date"

import { getLogsFromDay } from "../helpers/dailySummary"

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
      .orderBy("dateTime", "desc")
      .limit(21)
      .get()
    const bodyFatLogs = await this.props.firestore
      .collection("fitbit_users")
      .doc(this.props.uid)
      .collection("bodyFatLogs")
      .orderBy("dateTime", "desc")
      .limit(21)
      .get()
    console.log(await getLogsFromDay(this.props.firestore, this.props.uid, new Date(2018, 9, 4)))
    const massLogData = await Promise.all(massLogs.docs.map(async doc => doc.data()))
    const bodyFatLogsData = await Promise.all(bodyFatLogs.docs.map(async doc => doc.data()))
    this.setState({ massLogs: massLogData, bodyFatLogs: bodyFatLogsData })
  }
  render() {
    return (
      <Section title="Summary">
        {this.state.massLogs.map(({ weight, logId, dateTime }, index) => {
          const date = moment(fireStoreDateToDate(dateTime))
          return (
            <StyledRow key={`${logId}-${index}`}>
              <PeriodicCell label="date" unit={date.format("MMM")} value={date.format("DD")} />
              <PeriodicCell range={{ min: 0.2, max: 0.5 }} label="mass" unit="kg" value={weight} />
              <PeriodicCell label="bodyFat" unit="%" value={this.state.bodyFatLogs[index].fat} />
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
