/* @flow */
import React, { Component } from "react"

import Label from "../atoms/Label"
import Input from "../atoms/Input"

type Props = {
  label: string,
  hidden?: boolean,
  value: string,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
}

class TextInput extends Component<Props> {
  static defaultProps = {
    label: "",
    hidden: false,
    value: "",
    onChange: Function.prototype,
  }
  render() {
    const { label, hidden, onChange, value } = this.props
    return (
      <Label>
        {label}
        <Input type={hidden ? "password" : "text"} onChange={onChange} value={value} />
      </Label>
    )
  }
}

export default TextInput
