/* @flow */
import React, { Component } from "react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import moment from "moment"

import type { FirebaseType } from "../types/FirebaseType"

import { reverse } from "../helpers/collection"
import Section from "../templates/Section"
import { getDailySummaries } from "../helpers/dailySummary"

type Props = {
  firebase: FirebaseType,
  firestore: any,
  uid: string,
  days: number,
  latestDate: Date,
}

type State = {
  data: {
    macro: string,
    value: number,
    fullMark: number,
  }[],
}

/* eslint-disable id-length */
class MacroRadar extends Component<Props, State> {
  static defaultProps = { days: 60, latestDate: new Date() }
  state = {
    data: [
      { macro: "Protein", value: 120, fullMark: 10 },
      { macro: "Fat", value: 98, fullMark: 150 },
      { macro: "Carbohydrates", value: 86, fullMark: 42 },
    ],
  }

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
    console.log(data)
    // this.setState({ data })
  }
  render() {
    return (
      <Section title="Macros">
        <RadarChart outerRadius={90} width={730} height={250} data={this.state.data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="macro" />
          <PolarRadiusAxis angle={30} domain={[0, 250]} />
          <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </Section>
    )
  }
}
/* eslint-enable id-length */

export default compose(
  withFirebase,
  firestoreConnect(),
  connect(state => ({ uid: state.firebase.auth.uid })),
)(MacroRadar)
