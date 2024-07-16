import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import DatePicker, {DatePickerProps} from 'react-datepicker';

type DateInputProps = Partial<DatePickerProps> & {
    placeholder: string;
};

export default function MyDateInput(props: DateInputProps) {
    const [field, meta, helpers] = useField(props.name!); 
    return (
        <Form.Field
        style={{ height: '3rem' }}
        error={meta.touched && !!meta.error}>
            <DatePicker 
                {...field}
                placeholderText={props.placeholder}
                name={props.name}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}