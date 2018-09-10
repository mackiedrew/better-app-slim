/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

const FooterText = styled.small`
  font-weight: 100;
`

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
        <FooterText>Mackie Drew © 2018</FooterText>
      </StyledFooter>
    )
  }
}

export default Footer
