/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem;
`

type Props = {}

class Footer extends Component<Props> {
  render() {
    return (
      <StyledFooter>
        <small>All Rights Reserved, Mackie Drew, 2018</small>
      </StyledFooter>
    )
  }
}

export default Footer
