/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table``

const Heading = styled.th``

const Row = styled.tr``

const Cell = styled.td``

type DataKey = string
type Label = string

type Props = {
  headingLabels: {
    [DataKey]: Label,
  },
  rows: {
    [string]: null | void | boolean | string | number,
  }[],
}

class SimpleTable extends Component<Props> {
  static defaultProps = { headerLabels: [], rows: [] }
  /* eslint-disable-next-line complexity */
  cellPrep = (value: null | void | boolean | string | number): string => {
    if (typeof value === "boolean") return Boolean(value) ? "True" : "False"
    if (typeof value === "string") return value
    if (typeof value === "number") return value.toFixed(1)
    return "N/A"
  }
  render() {
    const { headingLabels, rows } = this.props
    const cellKeys = Object.keys(headingLabels)
    return (
      <TableContainer>
        <Table>
          <thead>
            <Row>
              {cellKeys.map((cellKey, headingIndex) => (
                <Heading key={`heading-${cellKey}-${headingIndex}`}>
                  {headingLabels[cellKey]}
                </Heading>
              ))}
            </Row>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <Row key={`row-${rowIndex}`}>
                {cellKeys.map((cellKey, cellIndex) => (
                  <Cell key={`cell-${cellKey}-${cellIndex}`}>{this.cellPrep(row[cellKey])}</Cell>
                ))}
              </Row>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    )
  }
}

export default SimpleTable
