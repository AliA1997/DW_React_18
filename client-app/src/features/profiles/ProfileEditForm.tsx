import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";

interface Props {
    setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({setEditMode}: Props) {
    const {profileStore: {profile, updateProfile}} = useStore();
    const { t } = useTranslation(['common', 'profile']);

    return (
        <Formik
            initialValues={{firstName: profile?.firstName, title: profile?.title}}
            onSubmit={values => {
                updateProfile(values).then(() => {
                    setEditMode(false);
                })
            }}
            validationSchema={Yup.object({
                firstName: Yup.string().required()
            })}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form className='ui form'>
                    <MyTextInput placeholder={t("name.first", {ns:"profile"})} name='firstName' />
                    <MyTextArea rows={3} placeholder={t("name.title", {ns:"profile"})} name='title' />
                    <Button 
                        positive
                        type='submit'
                        loading={isSubmitting}
                        content={t("profile.update", {ns:"profile"})}
                        floated='right'
                        disabled={!isValid || !dirty}
                    />
                </Form>
            )}
        </Formik>
    )
})
