/* @flow */
import React, { Component, Fragment } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import moment from "moment"

import type { FirebaseType } from "../types/FirebaseType"

import PeriodicTable from "../molecules/PeriodicTable"

import { getDailySummaries } from "../helpers/dailySummary"

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
    console.log(summaries.map(summary => new Date(summary.unixTimestamp)))
    this.setState({ summaries })
  }
  render() {
    const { summaries } = this.state
    return (
      <Fragment>
        {summaries
          .slice(0, -1)
          /* eslint-disable-next-line complexity */
          .map(({ mass, bodyFat, unixTimestamp, activitySummary, goals }, index) => {
            const date = moment(unixTimestamp)
            const yesterdayIndex = Math.min(index + 1, this.props.days)
            const { caloriesOut } = activitySummary || {}
            const { caloriesOut: caloriesOutGoal } = goals || {}
            const caloriesBurntRelative = caloriesOut - caloriesOutGoal
            return (
              <PeriodicTable
                key={`${unixTimestamp}-${index}`}
                cells={[
                  { label: "date", unit: date.format("MMM"), value: date.format("DD") },
                  {
                    label: "hr",
                    unit: "bpm",
                    value: activitySummary ? activitySummary.restingHeartRate : "?",
                    decimals: 0,
                  },
                  {
                    label: "burnt",
                    unit: "kcal",
                    value: `${caloriesBurntRelative >= 0 ? "+" : "-"}${Math.abs(
                      caloriesBurntRelative,
                    )}`,
                    sentiment: caloriesBurntRelative >= 0 ? "GOOD" : "BAD",
                  },
                  {
                    label: "mass",
                    unit: "kg",
                    range: { min: Math.abs(mass.min - mass.mean), max: mass.max - mass.mean },
                    value: mass.mean - summaries[yesterdayIndex].mass.mean,
                    sentiment: mass.mean <= summaries[yesterdayIndex].mass.mean ? "GOOD" : "BAD",
                  },
                  {
                    label: "bodyFat",
                    unit: "%",
                    range: {
                      min: Math.abs(bodyFat.min - bodyFat.mean),
                      max: bodyFat.max - bodyFat.mean,
                    },
                    value: bodyFat.mean - summaries[yesterdayIndex].bodyFat.mean,
                    sentiment:
                      bodyFat.mean <= summaries[yesterdayIndex].bodyFat.mean ? "GOOD" : "BAD",
                  },
                ]}
              />
            )
          })}
      </Fragment>
    )
  }
}

export default compose(
  withFirebase,
  firestoreConnect(),
  connect(state => ({ uid: state.firebase.auth.uid })),
)(SummaryTable)
