/* @flow */
import React, { Component, Fragment } from "react"
import styled from "styled-components"

import UserActions from "./UserActions"

const StyledHeader = styled.header`
  color: white;
  background-color: ${({ theme }) => theme.color.main};
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem;
`

const Navigator = styled.nav`
  display: flex;
  flex-flow: row wrap;
  background-color: ${({ theme }) => theme.color.mainLight};
`

const Link = styled.a`
  color: white;
  padding: 1rem;
  text-decoration: none;
  font-weight: 200;
`

type Props = {}

class Header extends Component<Props> {
  render() {
    return (
      <Fragment>
        <StyledHeader>
          <strong>Better App</strong>
          <UserActions />
        </StyledHeader>
        <Navigator>
          <Link href="/today">Today</Link>
          <Link href="/">Month</Link>
        </Navigator>
      </Fragment>
    )
  }
}

export default Header
