/* @flow */
import React, { Component } from "react"
import styled from "styled-components"

const LoadingText = styled.h2`
  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.color.black};
`

type Props = {}

class LoadingIndicator extends Component<Props> {
  static defaultProps = {}
  render() {
    return <LoadingText>Loading...</LoadingText>
  }
}

export default LoadingIndicator
