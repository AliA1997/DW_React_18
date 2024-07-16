import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ErrorMessage, Form, Formik } from "formik";
import UpdateCustomerForm from "./UpdateCustomerForm";

export default observer(function SearchCustomerByIdForm() {
  const { customerStore, modalStore } = useStore();
  const { t } = useTranslation(["common", "users", "errors"]);

  return (
    <Formik
      initialValues={{ searchId: "", error: null }}
      onSubmit={async (values, { setErrors }) => {
        await customerStore
            .getCustomerById(values.searchId)
            .catch((error) => setErrors({ error: error.response.data }));
        modalStore.openModal(<UpdateCustomerForm />);
      }}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <Header
            as="h2"
            content={t("searchCustomerById", { ns: "common" })}
            className="modal-text-color"
            textAlign="center"
          />
          <MyTextInput
            name="searchId"
            placeholder={t("searchCustomerById", { ns: "common" })}
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
            className="modal-button-color"
            size="huge"
            positive
            content={t("searchCustomerByIdButton", { ns: "common" })}
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
