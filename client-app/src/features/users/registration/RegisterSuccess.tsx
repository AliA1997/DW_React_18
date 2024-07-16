import React from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import useQuery from '../../../app/common/util/hooks';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

export default function RegisterSuccess() {
    const email = useQuery().get('email') as string;
    const { t } = useTranslation(['common', 'registration']);

    // function handleConfirmEmailResend() {
    //     agent.Account.resendEmailConfirm(email).then(() => {
    //         toast.success(t("email.resent", {ns:"registration"}));
    //     }).catch(error => console.log(error));
    // }

    return (
        <Segment placeholder textAlign='center'>
            <Header icon color='green'>
                <Icon name='check'/>
                {t("success", {ns:"registration"})}
            </Header>
            {/* <p>{t("message", {ns:"registration"})}</p> */}
                <Button primary as={Link} to="/"
                content={t("registration.login", {ns:"registration"})} size='huge' />
            
            {email &&
                <>
                    {/*  <p>{t("email.fail", {ns:"registration"})}</p>
                   <Button primary onClick={handleConfirmEmailResend} 
                        content={t("email.resend", {ns:"registration"})} size='huge' /> */}
                </>
            }
        </Segment>
    )
}