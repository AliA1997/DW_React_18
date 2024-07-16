import { useField } from 'formik';
import React, { useState } from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props {
    name: string;
    type?: string;
    label?: string;
}

export default function FileUploadInput(props: Props) {
    const [field, meta, helpers] = useField(props.name); 
    const [fileName, setFileName] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);
    
        // Convert the uploaded file to a URL
        const fileUrl = URL.createObjectURL(file);
        helpers.setValue(fileUrl);
      } else {
        helpers.setValue(undefined);
      }
    };
    
    return (
        <Form.Field error={meta.touched && !!meta.error} className="ui" name={props.name}>
            <input type="file" onChange={handleFileChange} />
            {fileName && <p>Selected file: {fileName}</p>}
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}