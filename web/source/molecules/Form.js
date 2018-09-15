/* @flow */
import React, { Component } from "react"
import type { Node } from "react"
import styled from "styled-components"

import Title from "../atoms/Title"
import Card from "../templates/Card"

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`

type Props = {
  title: string,
  children: Node[] | Node | void,
  onSubmit: Object => void,
}

class Form extends Component<Props> {
  render() {
    return (
      <StyledCard>
        <Title>{this.props.title}</Title>
        <form onSubmit={this.props.onSubmit}>{this.props.children}</form>
      </StyledCard>
    )
  }
}

export default Form
