import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../../app/api/agent';
import useQuery from '../../../app/common/util/hooks';
import { useStore } from '../../../app/stores/store';
import LoginForm from '../LoginForm';
import { useTranslation } from "react-i18next";

export default function ConfirmEmail() {
    const {modalStore} = useStore();
    const email = useQuery().get('email') as string;
    const token = useQuery().get('token') as string;
    const { t } = useTranslation(['common', 'registration']);

    const Status = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Success: 'Success'
    }

    const [status, setStatus] = useState(Status.Verifying);

    function handleConfirmEmailResend() {
        agent.Account.resendEmailConfirm(email).then(() => {
            toast.success(t("email.resend", {ns:"registration"}));
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        agent.Account.verifyEmail(token, email).then(() => {
            setStatus(Status.Success)
        }).catch(() => {
            setStatus(Status.Failed)
        })
    }, [Status.Failed, Status.Success, token, email])

    function getBody() {
        switch (status) {
            case Status.Verifying:
                return <p>{t("verifying", {ns:"registration"})}</p>;
            case Status.Failed:
                return (
                    <div>
                        <p>{t("verify_failure", {ns:"registration"})}</p>
                        <Button primary onClick={handleConfirmEmailResend} size='huge' content={t("email.resend", {ns:"registration"})} />
                    </div>
                );
            case Status.Success:
                return (
                    <div>
                        <p>{t("email.verified", {ns:"registration"})}</p>
                        <Button primary onClick={() => modalStore.openModal(<LoginForm />)} size='huge' />
                    </div>
                );
        }
    }

    return (
        <Segment placeholder textAlign='center'>
            <Header icon>
                <Icon name='envelope' />
                {t("email.verification", {ns:"registration"})}
            </Header>
            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    )
}