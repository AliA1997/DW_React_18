import { useField } from 'formik';
import React from 'react';
import { Form, Label, Radio, Select } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    options: string;
    label?: string;
}

export default function MyRadioGroup(props: Props) {
    const [field, meta, helpers] = useField(props.name); 
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <Radio
              label={props.label}
              name={props.name}
              value={props.options}
              onChange={(e, d) => helpers.setValue(d.value)}
              onBlur={() => helpers.setTouched(true)}
              placeholder={props.placeholder}
              checked= {field.value === props.options }
              
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}