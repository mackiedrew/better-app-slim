/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 0;
  flex-basis: 5rem;
  background-color: white;
  color: #555555;
  height: 5rem;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
`

const Value = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-weight: 200;
  font-size: 1.2rem;
  flex: 1;
`

const Unit = styled.span`
  margin: 0;
  padding: 0;
  font-weight: bold;
  align-self: center;
  font-weight: 100;
  margin-top: -0.2rem;
  font-size: 0.7rem;
`

const Label = styled.div`
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
  justify-items: flex-end;
  align-items: flex-end;
  color: #333333;
  font-weight: 700;
  letter-spacing: -1px;
  margin-right: 1px;
  margin-bottom: -0.2em;
  font-size: 0.9rem;
  flex: 0.6;
`

const Range = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
  font-size: 0.6rem;
  padding: 0 0.15rem;
`

const Less = styled.div`
  font-weight: 200;
`

const More = styled.div`
  font-weight: 700;
`

type Props = {
  value: number | string,
  label: string,
  unit: string,
  range?: {|
    min: number,
    max: number,
  |},
}

class PeriodicCell extends Component<Props> {
  render() {
    const { label, unit, value, range } = this.props
    const less = range ? `-${range.min}` : " "
    const more = range ? `+${range.max}` : " "
    return (
      <Container>
        <Range>
          <Less>{less}</Less>
          <More>{more}</More>
        </Range>
        <Value>{value}</Value>
        <Unit>{unit.toUpperCase()}</Unit>
        <Label>{label.toUpperCase()}</Label>
      </Container>
    )
  }
}

export default PeriodicCell
