import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { Checkbox, Form, Label } from "semantic-ui-react";

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  options?: string;
  updateValue?: (checked: boolean) => void;
  disabled: boolean;
}

export default function MyCheckbox(props: Props) {
  const [field, meta, helpers] = useField(props.name);
  const [childValue, setChildValue] = useState<boolean>(false);
  useEffect(() => {
    setChildValue(childValue);
  }, [field.checked, childValue]);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <Checkbox
        {...field}
        type="checkbox"
        checked={field.value}
        disabled={props.disabled}
        value={field.value.toString()}
        onChange={() => {
          setChildValue(!childValue);
          helpers.setValue(!childValue);
          field.checked = !childValue;
          if (props.updateValue) props.updateValue(field.checked);
        }}
        label={props.label}
        onBlur={() => helpers.setTouched(true)}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
