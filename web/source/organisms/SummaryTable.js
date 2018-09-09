/* @flow */
import React, { Component } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import moment from "moment"

import type { FirebaseType } from "../types/FirebaseType"

import PeriodicTable from "../molecules/PeriodicTable"
import Section from "../templates/Section"

type Props = {
  firebase: FirebaseType,
  firestore: any,
  uid: string,
  days: number,
}

type State = {
  summaries: Object[],
}

class SummaryTable extends Component<Props, State> {
  static defaultProps = { days: 21 }
  state = { summaries: [] }
  getDailySummaries = async (firestore, uid, days) => {
    const summariesSnapshot = await firestore
      .collection("users")
      .doc(uid)
      .collection("summaries")
      .orderBy("unixTimestamp", "desc")
      .limit(days)
      .get()
    const summaries = await Promise.all(summariesSnapshot.docs.map(async doc => doc.data()))
    return summaries
  }
  async componentDidMount() {
    const { firestore, uid, days } = this.props
    const summaries = await this.getDailySummaries(firestore, uid, days)
    this.setState({ summaries })
  }
  render() {
    const { summaries } = this.state
    return (
      <Section title="Days">
        {summaries.map(({ mass, bodyFat, unixTimestamp }, index) => {
          const date = moment(unixTimestamp)
          const yesterdayIndex = Math.min(index + 1, this.props.days - 1)
          return (
            <PeriodicTable
              key={`${unixTimestamp}-${index}`}
              cells={[
                { label: "date", unit: date.format("MMM"), value: date.format("DD") },
                {
                  label: "mass",
                  unit: "kg",
                  range: { min: Math.abs(mass.min - mass.mean), max: mass.max - mass.mean },
                  value: mass.mean,
                  sentiment: mass.mean <= summaries[yesterdayIndex].mass.mean ? "GOOD" : "BAD",
                },
                {
                  label: "bodyFat",
                  unit: "%",
                  range: {
                    min: Math.abs(bodyFat.min - bodyFat.mean),
                    max: bodyFat.max - bodyFat.mean,
                  },
                  value: bodyFat.mean,
                  sentiment:
                    bodyFat.mean <= summaries[yesterdayIndex].bodyFat.mean ? "GOOD" : "BAD",
                },
              ]}
            />
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
