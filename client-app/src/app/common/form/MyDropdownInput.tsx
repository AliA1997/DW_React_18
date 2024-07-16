import React, { useEffect, useState } from "react";
import { useField } from "formik";
import { observer } from "mobx-react-lite";
import { Dropdown, DropdownProps, Form, Label } from "semantic-ui-react";

interface Props {
  placeholder: string;
  name: string;
  options: any;
  label?: string;
  allowAdditions: boolean;
  disabled: boolean;
  className: string;
  onChangeFunction?: (value: any) => void;
}

export default observer(function MyDropdownInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);
  const [dropDownOptions, setDropDownOptions] = useState(props.options);

  useEffect(() => {
    if (props.options) setDropDownOptions(props.options);
  }, [props.options, setDropDownOptions]);

  const handleAddition = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    setDropDownOptions((prevOptions: any) => [
      { text: data.value, value: data.value },
      ...prevOptions,
    ]);
  };

  return (
    <Form.Field error={meta.touched && !!meta.error} className="ui" name={props.name} >
      <label className="myLabel" htmlFor={props.name}>{props.label}</label>
      <Dropdown
        name={props.name}
        clearable
        options={dropDownOptions}
        value={field.value || undefined || null}
        search
        selection
        selectOnBlur={true}
        additionPosition="top"
        allowAdditions={props.allowAdditions}
        disabled={props.disabled}
        onChange={(e, d) => {
            let val  = d.value !== "" ? d.value : null;
            helpers.setValue(val);
          if (props.onChangeFunction) props.onChangeFunction(d.value);
        }}
        onBlur={() => helpers.setTouched(true)}
        onAddItem={(e, d) => {
          if (d.value) handleAddition(e, d);
        }}
        placeholder={props.placeholder}
        className={props.className}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
});
