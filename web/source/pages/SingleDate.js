/* @flow */
import React, { Component, Fragment } from "react"
import { compose } from "recompose"
import styled from "styled-components"

import moment from "moment"

import withLoggedIn from "../containers/withLoggedIn"

import Title from "../atoms/Title"
import Row from "../templates/Row"
import Section from "../templates/Section"
import DailyStats from "../organisms/DailyStats"

const PageTitle = styled(Title)`
  margin: 0;
  padding: 0 1rem;
`

const CenteredRow = styled(Row)`
  margin: 1rem 0;
  justify-content: center;
  align-content: center;
`

type Props = {
  uid: string | null,
  date: Date,
  loggedIn: boolean,
  push: string => void,
  match: {
    params: {|
      month: string,
      year: string,
      day: string,
    |},
  },
}

class SingleDate extends Component<Props> {
  getDate = (): boolean | Date => {
    const { year, month, day } = this.props.match.params
    const providedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    if (providedDate > new Date()) return false
    return providedDate
  }
  render() {
    const date = this.props.date ? this.props.date : this.getDate()
    if (typeof date === "boolean") return null
    const momentDate = moment(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
    )
    const momentToday = moment(new Date())
    const nextDay = moment(momentDate).add(1, "days")
    const lastDay = moment(momentDate).subtract(1, "days")
    return (
      <Fragment>
        <CenteredRow>
          <a href={lastDay.format("/YYYY/MM/DD")}>{"<<"}</a>
          <PageTitle>{date.toDateString()}</PageTitle>
          {momentToday.format("YYYY-MM-DD") !== momentDate.format("YYYY-MM-DD") ? (
            <a href={nextDay.format("/YYYY/MM/DD")}>{">>"}</a>
          ) : null}
        </CenteredRow>
        <Section title={"Summary"}>
          <DailyStats days={1} latestDate={date} />
        </Section>
      </Fragment>
    )
  }
}

export default compose(withLoggedIn({ showLogin: true }))(SingleDate)
