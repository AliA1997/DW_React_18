import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Button, Header, Message } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { useStore } from "../../../app/stores/store";
import * as Yup from "yup";
import ValidationErrors from "../../errors/ValidationErrors";
import { useTranslation } from "react-i18next";
import PhoneNumberInput from "../../../app/common/form/PhoneNumberInput";

export default observer(function RegisterForm() {
  const { userStore } = useStore();
  const { t } = useTranslation(["common", "profile", "errors"]);
  const phoneRegExp = new RegExp(
    "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$"
  );
  const nameRegExp = new RegExp("^([a-zA-Z.'-,]).{1,50}$");
  const userNameExp = new RegExp(
    "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
  );
  const passwordExp = new RegExp(
    "^(?=[^\\d_].*\\d)(?=.*[a-z])(?=.*[A-Z])(?!@#$%.*\\s).{8,50}$"
  );
  //TODO will need to fixc Mycheckbox to allow for dynamic load and beable to get list
  //TODO get client ID to pass in.

  const { clientId, getInternalClientId } = userStore;
  useEffect(() => {
    if (!clientId) getInternalClientId();
  }, [clientId, getInternalClientId]);

  return (
    <Formik
      initialValues={{
        //application: [],
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        phoneNumber: "",
        password: "",
        error: null,
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
      validationSchema={Yup.object({
        //application: Yup.array().min(1).required(),
        firstName: Yup.string()
          .required(t("registration.required_FirstName", { ns: "errors" }))
          .matches(
            nameRegExp,
            t("registration.invalid_FirstName", { ns: "errors" })
          ),
        lastName: Yup.string()
          .required(t("registration.required_LastName", { ns: "errors" }))
          .matches(
            nameRegExp,
            t("registration.invalid_LastName", { ns: "errors" })
          ),
        email: Yup.string()
          .required(t("registration.required_Email", { ns: "errors" }))
          .email(),
        username: Yup.string()
          .required(t("registration.required_UserName", { ns: "errors" }))
          .matches(
            userNameExp,
            t("registration.invalid_UserName", { ns: "errors" })
          ),
        phoneNumber: Yup.string()
          .required(t("registration.required_PhoneNumber", { ns: "errors" }))
          .matches(
            phoneRegExp,
            t("registration.invalid_PhoneNumber", { ns: "errors" })
          ),
        password: Yup.string()
          .required(t("registration.required_Password", { ns: "errors" }))
          .matches(
            passwordExp,
            t("registration.invalid_Password", { ns: "errors" })
          ),
        confirmPassword: Yup.string().required(
          t("registration.required_Password", { ns: "errors" })
        ),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className="ui form error form-background-color"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            as="h2"
            content={t("signup", { ns: "common" })}
            className="modal-text-color"
            textAlign="left"
          />
          <Message info>{t("mission", { ns: "common" })}</Message>
          <MyTextInput
            name="username"
            placeholder={t("username", { ns: "common" })}
          />
          <MyTextInput
            name="email"
            placeholder={t("email", { ns: "common" })}
          />
          <MyTextInput
            name="firstName"
            placeholder={t("name.first", { ns: "profile" })}
          />
          <MyTextInput
            name="lastName"
            placeholder={t("name.last", { ns: "profile" })}
          />
          <PhoneNumberInput
            name="phoneNumber"
            placeholder={t("phonenumber", { ns: "common" })}
          ></PhoneNumberInput>
          {/* <MyTextInput
            name="phoneNumber"
            placeholder={t("phonenumber", { ns: "common" })}
          /> */}
          <MyTextInput
            name="password"
            placeholder={t("password", { ns: "common" })}
            type="password"
          />
          <MyTextInput
            name="confirmPassword"
            placeholder={t("confirmPassword", { ns: "common" })}
            type="password"
          />
          <ErrorMessage
            name="error"
            render={() => <ValidationErrors errors={errors.error} />}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
            className="modal-button-color"
            positive
            content={t("signup", { ns: "common" })}
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
