import { Formik } from 'formik';
import { t } from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Header, Segment } from 'semantic-ui-react';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { UserCardDTO } from '../../../app/models/user';
import * as Yup from 'yup';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserStore from '../../../app/stores/userStore';
import { useStore } from '../../../app/stores/store';
import MyDropdownInput from '../../../app/common/form/MyDropdownInput';

interface Props {
    id?: string;
    user?: UserCardDTO;
  }      

export default observer(function Details(props: Props) {
    const { t } = useTranslation(["common", "errors"]);
    const navigate = useNavigate();
    const { userStore } = useStore();
    const { createUser, updateUser, loadingInitial, roleList, loadRoleList } = userStore;
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if ( roleList  &&  roleList.length <= 1) loadRoleList();
      }, [ roleList ,  roleList.length, loadRoleList]);

    const validationSchema = Yup.object({
        firstName: Yup.string().required(t("registration.invalid_FirstName", { ns: "errors" })),
        lastName: Yup.string().required(t("registration.invalid_LastName", { ns: "errors" })),
        username: Yup.string().required(t("registration.invalid_UserName", { ns: "errors" })),
        email: Yup.string().required(t("registration.invalid_Email", { ns: "errors" })),
        roles: Yup.string().required(t("registration.required_Roles", { ns: "errors" })),
        phoneNumber: Yup.string().required(t("registration.invalid_PhoneNumber", {ns: "errors"})),
        password: Yup.string().required(t("registration.invalid_Password", {ns: "errors"})),
    })
    const [user] = useState<UserCardDTO>({
        id: '',
        email: '',
        username: '',
        roles: '', 
        firstName: '',
        lastName: '',
        application: [],
        isInternal : true,
        clientId: '',
        password: '',
        phoneNumber: ''
    })
    

    function handleFormSubmit(user: UserCardDTO) {
        console.log("click");
        if (user.id) {
          let newUser = {
            ...user,
          };
          createUser(newUser).then(() => navigate("/users"));
        } else {
          updateUser(user).then(() => navigate("/users"));
        }
      }
    
      if (loadingInitial)
        return <LoadingComponent content={t("loading", { ns: "common" })} />;
    

    return(
        <Segment clearing>
            <Header
            as="h1"
            content={t("details.title", { ns: "users" })}
            className="modal-text-color"
            textAlign="left"
            />
            <Divider />
            <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={user}
            isInitialValid={false}
            onSubmit={(values) => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput 
                        placeholder={t("details.first_name", { ns: "users" })}
                        label={t("details.first_name", { ns: "users" }) + ":"}
                        name="firstName"></MyTextInput>
                    <MyTextInput 
                        placeholder={t("details.last_name", { ns: "users" })}
                        label={t("details.last_name", { ns: "users" }) + ":"}
                        name="lastName"></MyTextInput>
                    <MyTextInput 
                        placeholder={t("details.user_name", { ns: "users" })}
                        label={t("details.user_name", { ns: "users" }) + ":"}
                        name="username"></MyTextInput>
                    <MyTextInput 
                        placeholder={t("details.email", { ns: "users" })}
                        label={t("details.email", { ns: "users" }) + ":"}
                        name="email"></MyTextInput>
                    <MyTextInput 
                        placeholder={t("details.phone_number", { ns: "users" })}
                        label={t("details.phone_number", { ns: "users" }) + ":"}
                        name="phoneNumber"></MyTextInput>
                        <MyTextInput 
                        placeholder={t("details.password", { ns: "users" })}
                        label={t("details.password", { ns: "users" }) + ":"}
                        name="password"></MyTextInput>
                     <MyDropdownInput 
                        placeholder={t("details.roles", { ns: "users" })}
                        label={t("details.roles", { ns: "users" }) + ":"}
                        name="roles"
                        options={roleList}
                        allowAdditions={false}
                        className=""
                        disabled={false}></MyDropdownInput>
                    <Button
                        color='green' 
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting} 
                        floated="right"
                        type="submit"
                        content={t("details.submit", { ns: "users" })}
                    />
                    <Button
                        as={Link}
                        to="/users"
                        floated="right"
                        type="button"
                        content={t("cancel", { ns: "common" })}
                    />
                </Form>
                )}
            </Formik>
        </Segment>
        )
})