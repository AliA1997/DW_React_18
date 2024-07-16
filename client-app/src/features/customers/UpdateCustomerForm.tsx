import { ErrorMessage, Form, Formik, FormikErrors } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";
import { Button, Header, Message } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationErrors from "../errors/ValidationErrors";
import { useTranslation } from "react-i18next";
import PhoneNumberInput from "../../app/common/form/PhoneNumberInput";
import { Customer, UpdateCustomerDTO } from "../../app/models/customer";
import MyDateInput from "../../app/common/form/MyDateInput";
import ColorSelector from "../../app/common/form/ColorSelector";
import FileUploadInput from "../../app/common/form/FileUploadInput";


export default observer(function UpdateCustomerForm() {
  const { customerStore } = useStore();
  const { t } = useTranslation(["common", "profile", "errors"]);
  const phoneRegExp = new RegExp(
   "^(\\(\\d{3}\\)[\\s.-]?|\\d{3}[\\s.-]?)?\\d{3}[\\s.-]?\\d{4}$"
  );
  const nameRegExp = new RegExp("^([a-zA-Z.'-,]).{1,50}$");
  const emailExp = new RegExp(
    "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$"
  );
  const customerDetails = useMemo(() => customerStore.customerToUpdate, [customerStore.customerToUpdate]);
  return (
    <Formik
      initialValues={{
        firstName: customerDetails?.firstName ?? '',
        lastName: customerDetails?.lastName ?? '',
        email: customerDetails?.email,
        phoneNumber: customerDetails?.phoneNumber ?? '',
        favoriteColor: customerDetails?.favoriteColor ?? '',
        avatar: customerDetails?.avatar ?? '',
      }}
      onSubmit={(values, { setErrors }) =>
        customerStore.updateCustomer(customerDetails?.id!, values as any).catch((error: any) => setErrors(error)
      )}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .required(t("update_customer.required_FirstName", { ns: "errors" }))
          .matches(
            nameRegExp,
            t("update_customer.invalid_FirstName", { ns: "errors" })
          ),
        lastName: Yup.string()
          .required(t("update_customer.required_LastName", { ns: "errors" }))
          .matches(
            nameRegExp,
            t("update_customer.invalid_LastName", { ns: "errors" })
          ),
        email: Yup.string()
          .required(t("update_customer.required_Email", { ns: "errors" }))
          .email(),
        phoneNumber: Yup.string()
          .required(t("update_customer.required_PhoneNumber", { ns: "errors" }))
          .matches(
            phoneRegExp,
            t("update_customer.invalid_PhoneNumber", { ns: "errors" })
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
            content={t("updateCustomer", { ns: "common" })}
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
          <ColorSelector
            name="favoriteColor"
          />
          <MyTextInput
            name="avatar"
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
            content={t("updateCustomer", { ns: "common" })}
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
