/* @flow */
import React, { Component, Fragment } from "react"
import styled from "styled-components"

import withLoggedIn from "../containers/withLoggedIn"

import Button from "../atoms/Button"
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
  loggedIn: boolean,
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
    const date = this.getDate()
    if (typeof date === "boolean") return null
    return (
      <Fragment>
        <CenteredRow>
          <Button>Previous</Button>
          <PageTitle as="h1">{date.toDateString()}</PageTitle>
          <Button>Next</Button>
        </CenteredRow>
        <Section title={"Summary"}>
          <DailyStats days={1} latestDate={date} />
        </Section>
      </Fragment>
    )
  }
}

export default withLoggedIn(SingleDate)
