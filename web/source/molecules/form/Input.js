/* @flow */
import React, { Component } from "react"

import { Field } from "redux-form"

import Label from "./Label"

type Props = {
  label: string,
  name: string,
}

class Input extends Component<Props> {
  static defaultProps = { label: "" }
  render() {
    const { label, ...restOfProps } = this.props
    return (
      <Label htmlFor={this.props.name}>
        {label}
        <Field {...restOfProps} />
      </Label>
    )
  }
}

export default Input
