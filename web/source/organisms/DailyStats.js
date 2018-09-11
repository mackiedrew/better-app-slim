/* @flow */
import React, { Component, Fragment } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import type { FirebaseType } from "../types/FirebaseType"

import PeriodicTable from "../molecules/PeriodicTable"

import { getDailySummaries, summariesToTable } from "../helpers/dailySummary"

type Props = {
  firebase: FirebaseType,
  firestore: any,
  uid: string,
  days: number,
  latestDate: Date,
}

type State = {
  summaries: Object[],
}

class SummaryTable extends Component<Props, State> {
  static defaultProps = { days: 3, latestDate: new Date() }
  state = { summaries: [] }

  async componentDidMount() {
    const { firestore, uid, days, latestDate } = this.props
    const summaries = await getDailySummaries(firestore, uid, { days, latestDate })
    this.setState({ summaries })
  }
  render() {
    return (
      <Fragment>
        {summariesToTable(this.state.summaries).map((cells, index) => (
          <PeriodicTable key={`${index}`} cells={cells} />
        ))}
      </Fragment>
    )
  }
}

export default compose(
  withFirebase,
  firestoreConnect(),
  connect(state => ({ uid: state.firebase.auth.uid })),
)(SummaryTable)
