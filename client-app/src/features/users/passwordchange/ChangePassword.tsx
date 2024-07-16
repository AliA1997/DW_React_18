import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Container, Divider, Header, Label, Segment } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { useStore } from "../../../app/stores/store";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ValidationErrors from "../../errors/ValidationErrors";
import * as Yup from "yup";
import { UserChangePassword } from "../../../app/models/user";

export default observer(function ChangePassword() {
  const { id } = useParams<{ id: string }>();
  const { userStore } = useStore();
  const { t } = useTranslation(["common", "users"]);

  return (
    <>
      <Header
        as="h1"
        content={t("password.change", { ns: "users" })}
        className="modal-text-color"
        textAlign="left"
      />
      <Divider />
      <Container text>
        <Segment className="form-background-color">
          <p>{t("password.change_message", { ns: "users" })}</p>
          <Formik
            initialValues={{
              id: id,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
              error: null,
            }}
            onSubmit={(values, { setErrors }) =>
              userStore
                .changePassword(values as UserChangePassword, id!)
                .catch((error) => setErrors({ error: error.response.data }))
            }
            validationSchema={Yup.object({
              currentPassword: Yup.string().required(),
              newPassword: Yup.string().required(),
              confirmPassword: Yup.string().required(),
            })}
          >
            {({ handleSubmit, isSubmitting, errors }) => (
              <Form
                className="ui form form-background-color"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <MyTextInput
                  name="currentPassword"
                  placeholder={t("password.current", { ns: "users" })}
                  type="password"
                />
                <MyTextInput
                  name="newPassword"
                  placeholder={t("password.new", { ns: "users" })}
                  type="password"
                />
                <MyTextInput
                  name="confirmPassword"
                  placeholder={t("password.confirm", { ns: "users" })}
                  type="password"
                />
                <ErrorMessage
                  name="error"
                  render={() => (
                    <Label
                      style={{ marginBottom: 10 }}
                      basic
                      color="red"
                      content={t(`${errors.error}`)}
                    />
                  )}
                />
                <ErrorMessage
                  name="error"
                  render={() => (
                    <ValidationErrors errors={errors.error} />
                  )}
                />
                <Button
                  loading={isSubmitting}
                  color="green"
                  size="huge"
                  positive
                  content={t("password.update", { ns: "users" })}
                  type="submit"
                />
              </Form>
            )}
          </Formik>
        </Segment>
      </Container>
    </>
  );
});
