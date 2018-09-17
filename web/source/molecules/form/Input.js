/* @flow */
import React, { Component } from "react"

import { Field } from "redux-form"

import Label from "./Label"

type Props = {
  label: string,
  name: string,
  component: string,
  type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week",
  checked?: boolean,
  name: string,
  onBlur?: Function,
  onChange?: Function,
  onDrop?: Function,
  onDragStart?: Function,
  onFocus?: Function,
  value?: any,
  meta?: {
    active: boolean,
    asyncValidating: boolean,
    autofilled: boolean,
    dirty: boolean,
    error?: any,
    form: string,
    initial?: any,
    invalid: boolean,
    pristine: boolean,
    submitting: boolean,
    submitFailed: boolean,
    touched: boolean,
    valid: boolean,
    visited: boolean,
    warning?: any,
  },
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
