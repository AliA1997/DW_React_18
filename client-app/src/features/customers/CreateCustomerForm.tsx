import { ErrorMessage, Form, Formik, FormikErrors } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Button, Header, Message } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationErrors from "../errors/ValidationErrors";
import { useTranslation } from "react-i18next";
import PhoneNumberInput from "../../app/common/form/PhoneNumberInput";
import MyDateInput from "../../app/common/form/MyDateInput";
import ColorSelector from "../../app/common/form/ColorSelector";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import FileUploadInput from "../../app/common/form/FileUploadInput";

export default observer(function CreateCustomerForm() {
  const { customerStore } = useStore();
  const { t } = useTranslation(["common", "profile", "errors"]);
  const phoneRegExp = new RegExp(
    "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$"
  );
  const nameRegExp = new RegExp("^([a-zA-Z.'-,]).{1,50}$");
  const emailExp = new RegExp(
    "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$"
  );
  //TODO will need to fixc Mycheckbox to allow for dynamic load and beable to get list
  //TODO get client ID to pass in.

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
        favoriteColor: "#561ecb",
        photo: ""
      }}
      onSubmit={(values, { setErrors }) => customerStore.createCustomer(values as any).catch((error: any) => setErrors(error))}
      validationSchema={Yup.object({
        //application: Yup.array().min(1).required(),
        firstName: Yup.string()
          .required(t("create_customer.required_FirstName", { ns: "errors" }))
          .matches(
            nameRegExp,
            t("create_customer.invalid_FirstName", { ns: "errors" })
          ),
        lastName: Yup.string()
          .required(t("create_customer.required_LastName", { ns: "errors" }))
          .matches(
            nameRegExp,
            t("create_customer.invalid_LastName", { ns: "errors" })
          ),
        email: Yup.string()
          .required(t("create_customer.required_Email", { ns: "errors" }))
          .email(),
        phoneNumber: Yup.string()
          .required(t("create_customer.required_PhoneNumber", { ns: "errors" }))
          .matches(
            phoneRegExp,
            t("create_customer.invalid_PhoneNumber", { ns: "errors" })
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
            content={t("createCustomer", { ns: "common" })}
            className="modal-text-color"
            textAlign="left"
          />
          <Message info>{t("mission", { ns: "common" })}</Message>
          <MyTextInput
            name="firstName"
            placeholder={t("name.first", { ns: "profile" })}
          />
          <MyTextInput
            name="lastName"
            placeholder={t("name.last", { ns: "profile" })}
          />
          <MyTextInput
            name="email"
            placeholder={t("email", { ns: "common" })}
          />
          <PhoneNumberInput
            name="phoneNumber"
            placeholder={t("phonenumber", { ns: "common" })}
          ></PhoneNumberInput>
          <MyDateInput
            placeholder="Birth Date"
            name="birthDate"
          />
          <ColorSelector
            name="favoriteColor"
          />
          <MyTextInput
            name="photo"
            placeholder={t("photo", { ns: "common" })}
          />
          <ErrorMessage
            name="error"
            render={() => <ValidationErrors errors={{...errors}} />}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
            className="modal-button-color"
            positive
            content={t("createCustomer", { ns: "common" })}
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
