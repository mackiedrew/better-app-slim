/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

import type { PeriodicCellProps } from "../molecules/PeriodicCell"

import PeriodicCell from "../molecules/PeriodicCell"
import Row from "../templates/Row"

const Table = styled(Row)`
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 1rem;
`

type Props = {
  cells: PeriodicCellProps[],
  keyExtractor: (PeriodicCellProps, number) => string,
}

class PeriodicTable extends Component<Props> {
  static defaultProps = {
    cells: [],
    keyExtractor: (cell: PeriodicCellProps, index: number) =>
      `${index}-${cell.label}-${cell.unit}-${cell.value}`,
  }
  render() {
    const { cells, keyExtractor } = this.props
    return (
      <Table>
        {cells.map((cell, index) => (
          <PeriodicCell key={keyExtractor(cell, index)} {...cell} />
        ))}
      </Table>
    )
  }
}

export default PeriodicTable
