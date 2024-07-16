import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";
import { PatternFormat } from "react-number-format";

interface Props {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
}



export default function MyTextInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);
  return (
    <Form.Field
      error={meta.touched && !!meta.error}
      className="ui"
      name={props.name}
    >
      <label className="myLabel" htmlFor={props.name}>
        {props.label}
      </label>
      <PatternFormat
        {...field}
        {...props}
        type="tel"
        format="(###) ###-####"
        mask="_"
        placeholder={props.placeholder}
        onValueChange={(value) => {helpers.setValue(value.formattedValue);}}
        required
        allowEmptyFormatting
      ></PatternFormat>
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
