/* @flow */
import React, { Component } from "react"
import type { Node } from "react"
import styled from "styled-components"

import Title from "../atoms/Title"

import Column from "./Column"

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid #dddddd;
`

const Content = styled(Column)`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`

type Props = {
  title: string,
  children: Node[] | Node | void,
}

class Section extends Component<Props> {
  render() {
    return (
      <StyledSection>
        <Title>{this.props.title}</Title>
        <Content>{this.props.children}</Content>
      </StyledSection>
    )
  }
}

export default Section
