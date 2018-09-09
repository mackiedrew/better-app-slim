/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

import { toFixed } from "../helpers/round"

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 0;
  flex-basis: 5rem;
  background-color: ${({ sentiment, theme }) => {
    switch (sentiment) {
      case "GOOD":
        return theme.color.green
      case "BAD":
        return theme.color.red
      case "MIXED":
        return theme.color.yellow
      case "NONE":
      default:
        return "white"
    }
  }};
  color: ${({ theme }) => theme.color.nearlyBlack};
  height: 5rem;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
`

const Value = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-weight: 300;
  font-size: 1.4rem;
  flex: 1;
`

const Unit = styled.span`
  margin: 0;
  padding: 0;
  font-weight: bold;
  align-self: center;
  font-weight: 200;
  margin-top: -0.2rem;
  font-size: 0.9rem;
`

const Label = styled.div`
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
  justify-items: flex-end;
  align-items: flex-end;
  color: ${({ theme }) => theme.color.nearlyBlack};
  font-weight: 700;
  letter-spacing: -1px;
  margin-right: 1px;
  margin-bottom: -0.2em;
  font-size: 1.1rem;
  flex: 0.6;
`

const Range = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
  font-size: 0.75rem;
  padding: 0 0.15rem;
`

const Less = styled.div`
  font-weight: 200;
`

const More = styled.div`
  font-weight: 700;
`

export type PeriodicCellProps = {
  decimals?: number,
  value: number | string,
  label: string,
  unit: string,
  sentiment?: "BAD" | "GOOD" | "MIXED" | "NONE",
  range?: {|
    min: number,
    max: number,
  |},
}

class PeriodicCell extends Component<PeriodicCellProps> {
  static defaultProps = {
    sentiment: "NONE",
    decimals: 1,
  }
  render() {
    const { label, unit, value, range, sentiment, decimals } = this.props
    const less = range ? `-${toFixed(range.min, decimals)}` : " "
    const more = range ? `+${toFixed(range.max, decimals)}` : " "
    return (
      <Container sentiment={sentiment}>
        <Range>
          <Less>{less}</Less>
          <More>{more}</More>
        </Range>
        <Value>{typeof value === "number" ? toFixed(value, decimals) : value}</Value>
        <Unit>{unit.toUpperCase()}</Unit>
        <Label>{label.toUpperCase()}</Label>
      </Container>
    )
  }
}

export default PeriodicCell
