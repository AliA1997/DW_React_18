import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { ErrorMessage, Form, Formik } from 'formik';


export default observer(function LoginForm() {
    const {userStore} = useStore();
    const { t } = useTranslation(['common', 'users', 'errors']);

    return (
        <Formik
            initialValues={{login: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(error => 
                setErrors({error: error.response.data}))}
        >
            {({handleSubmit, isSubmitting, errors}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content={t("login", {ns:"common"})} className='modal-text-color' textAlign='center' />
                    <MyTextInput name='login' placeholder={t("email_username", {ns:"common"})} />
                    <MyTextInput name='password' placeholder={t("password", {ns:"common"})} type='password' />
                    <ErrorMessage 
                        name='error' render={() => 
                        <Label style={{marginBottom: 10}} basic color='red' content={t(`${errors.error}`, {ns:"errors"})}/>}
                    />
                    <Button loading={isSubmitting} className='modal-button-color' size="huge" positive content={t("login", {ns:"common"})} type='submit' fluid />
                    <Link to={'/forgotpassword'}>{t("login.forgot_password", {ns:"users"})}</Link>
                </Form>
            )}
        </Formik>
    )
})