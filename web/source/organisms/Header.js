/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

import UserActions from "./UserActions"

const StyledHeader = styled.header`
  background-color: #cccccc;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
`

type Props = {}

class Header extends Component<Props> {
  render() {
    return (
      <StyledHeader>
        <strong>Better App</strong>
        <UserActions />
      </StyledHeader>
    )
  }
}

export default Header
