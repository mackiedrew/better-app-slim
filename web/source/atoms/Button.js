import styled, { css } from "styled-components"

export const buttonStyle = `
  color: white;
  background-color: ${({ theme }) => theme.color.mainLight};
  border: 0;
  padding: 0.75rem;
  margin: 0 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.color.lightGrey};
  &:hover {
    background-color: ${({ theme }) => theme.color.mainLighter};
  }
  &:active {
    border: 0;
  }
`

export default styled.button(css(buttonStyle))
