import { observer } from 'mobx-react-lite';
import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { useTranslation } from "react-i18next";

export default observer(function ServerError() {
    const {commonStore} = useStore();
    const { t } = useTranslation(['common', 'errors']);

    return (
        <Container>
            <Header as='h1' content= {t("server", {ns:"errors"})} />
            <Header sub as='h5' color='red' content={t(`${commonStore.error?.message}`)} />
            {commonStore.error?.details &&
                <Segment>
                    <Header as='h4' content={t("stack_trace", {ns:"errors"})} color='teal' />
                    <code style={{marginTop: '10px'}}>{t(`${commonStore.error.details}`)} </code>
                </Segment>
                
            }
        </Container>
    )
})