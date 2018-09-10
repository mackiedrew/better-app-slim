/* @flow */
import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import moment from "moment"

import type { FirebaseType } from "../types/FirebaseType"

import { reverse } from "../helpers/collection"
import { mRound } from "../helpers/round"
import { getDailySummaries } from "../helpers/dailySummary"
import theme from "../theme"

type Props = {
  firebase: FirebaseType,
  firestore: any,
  uid: string,
  days: number,
  latestDate: Date,
}

type State = {
  data: {
    date: string,
    min: number,
    max: number,
    mean: number,
  }[],
}

/* eslint-disable id-length */
class MassChart extends Component<Props, State> {
  static defaultProps = { days: 7, latestDate: new Date() }
  state = { data: [] }

  async componentDidMount() {
    const { firestore, uid, days, latestDate } = this.props
    const summaries = await getDailySummaries(firestore, uid, { days, latestDate })
    const data = reverse(
      summaries
        .map(({ unixTimestamp, mass }) => ({
          date: moment(new Date(unixTimestamp)).format("MMM DD"),
          min: mass.min,
          max: mass.max,
          mean: mass.mean,
        }))
        .filter(({ min, max, mean }) => min && max && mean),
    )
    this.setState({ data })
  }
  render() {
    return (
      <LineChart width={600} height={300} data={this.state.data}>
        <XAxis dataKey="date" />
        <YAxis
          type="number"
          domain={[dataMin => mRound(dataMin - 5, 5), dataMax => mRound(dataMax + 5, 5)]}
        />
        <CartesianGrid strokeDasharray="5 5" />
        <Line type="monotone" dataKey="min" stroke={theme.color.blue} />
        <Line type="monotone" dataKey="mean" stroke={theme.color.green} />
        <Line type="monotone" dataKey="max" stroke={theme.color.red} />
        <Tooltip formatter={value => value.toFixed(1)} />
      </LineChart>
    )
  }
}
/* eslint-enable id-length */

export default compose(
  withFirebase,
  firestoreConnect(),
  connect(state => ({ uid: state.firebase.auth.uid })),
)(MassChart)
