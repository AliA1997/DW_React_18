import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({inverted = true, content = 'loading'}: Props) {
    const { t } = useTranslation(['common']);
    return (
        <Dimmer active={true} inverted={inverted}>
            <Loader content={t(content)} />
        </Dimmer>
    )
}