import React from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from 'semantic-ui-react';

interface Props {
    errors: any;
}

export default function ValidationErrors({errors}: Props) {
    const { t } = useTranslation(["common", "errors"]);
    
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((err: any, i: any) => (
                        <Message.Item key={i}>{t(err, { ns: "errors" })}</Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    )
}