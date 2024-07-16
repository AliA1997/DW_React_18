import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import {
  Button,
  Container,
  Grid,
  Label,
  Segment,
} from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { useStore } from "../../../app/stores/store";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PageHeader from "../../../app/layout/PageHeader";

export default observer(function ForgotPassword() {
  const { userStore } = useStore();
  const { t } = useTranslation(["common", "users", "errors"]);

  return (
    <>
		<PageHeader header={t("password.forgot_label", { ns: "users" })} ></PageHeader>
      <Grid stackable columns={2}>
		  <Grid.Column>
        <Segment textAlign="left" className="form-background-color">
          <Formik
            initialValues={{ email: "", error: null }}
            onSubmit={(values, { setErrors }) =>
              userStore
                .requestPasswordReset(values)
                .catch((error) => setErrors({ error: error.response.data }))
            }
            validationSchema={Yup.object({
              email: Yup.string().required().email(),
            })}
          >
            {({ handleSubmit, isSubmitting, errors }) => (
              <Form
                className="ui form"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <Container>
                  {t("password.forgot_message", { ns: "users" })}
                </Container>
                <MyTextInput
                  name="email"
                  placeholder={t("email", { ns: "common" })}
                />
                <ErrorMessage
                  name="error"
                  render={() => (
                    <Label
                      style={{ marginBottom: 10 }}
                      basic
                      color="red"
                      content={t(`${errors.error}`, { ns: "errors" })}
                    />
                  )}
                />
                <Button
                  loading={isSubmitting}
                  size="large"
                  positive
                  content={t("password.forgot_button", { ns: "users" })}
				  color={"green"}
                  type="submit"
                />
              </Form>
            )}
          </Formik>
        </Segment>
		</Grid.Column>
      </Grid>
    </>
  );
});
