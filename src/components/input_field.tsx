/** @file Provides an Input field. */

import { Component, RefObject } from 'react';

export type InputFieldProps = {
  // Shared props.
  id: string;
  // Label props.
  label?: string;
  // Input props.
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  required?: boolean;
  type: string;
  value?: string | number;
};

type LabelProps = {
  htmlFor: string;
  label?: string;
}

type InputProps = {
  id: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement | null>;
  required?: boolean;
  type: string;
  defaultValue?: string | number;
}

/** A form field with its label. */
export class InputField extends Component<InputFieldProps> {

  /** Renders the input field and its label. */
  render() {
    const labelProps: LabelProps = {
      htmlFor: this.props.id,
    };
    if (this.props.label) labelProps.label = this.props.label;

    const inputProps: InputProps = {
      id: this.props.id,
      type: this.props.type,
    };
    if (this.props.inputRef) inputProps.ref = this.props.inputRef;
    if (this.props.required) inputProps.required = this.props.required;
    if (this.props.placeholder) inputProps.placeholder = this.props.placeholder;
    if (this.props.value) inputProps.defaultValue = this.props.value;

    return <div className="field">
      {
        labelProps.label ?
          <label {...labelProps}>
            {labelProps.label}{
              inputProps.required ? <span> (required)</span> :
              <></>
            }
          </label> :
          <></>
      }
      <input {...inputProps} />
    </div>;
  }
}
