import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, Header, Segment, Button, Grid } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/registration/RegisterForm";
import "../../app/common/i18n/i18n.ts";
import { useTranslation } from "react-i18next";
import CreateCustomerForm from "../customers/CreateCustomerForm.tsx";
import SearchCustomerByIdForm from "../customers/SearchCustomerByIdForm.tsx";
import CustomerCard from "../customers/CustomerCard.tsx";

export default observer(function HomePage() {
  const { userStore, modalStore, customerStore } = useStore();
  //i18n.init();
  const { t } = useTranslation([
    "common",
    "translation",
    "registration",
    "createCustomer",
    "updateCustomer",
    "users",
  ]);

  useEffect(
    () => {
      customerStore.getCustomers();
    }, 
    []
  )

  const customersToDisplay = useMemo(() => customerStore.allCustomers, [customerStore.allCustomers]);

  return (
    <>
      <Segment textAlign="center" vertical >
        <Container text>
          {userStore.isLoggedIn ? (
            <>
              <Header
                as="h2"
                inverted
                content={t("welcome", { ns: "common" })}
              />
              <Button as={Link} to="/tickets" size="huge" inverted>
                {t("goto", { ns: "common" })}
              </Button>
            </>
          ) : (
            <>
              <>
                <Grid stackable columns={2} className="margin-top-2 scrollable-container">
                  <Grid.Column>
                    <Segment className="form-background-color">
                      <LoginForm />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment className="fill-height form-background-color">
                      <Header
                        as="h2"
                        content={t("header", { ns: "registration" })}
                        className="modal-text-color"
                        textAlign="center"
                      />

                      <Button
                        onClick={() => modalStore.openModal(<RegisterForm />)}
                        size="huge"
                        positive
                      >
                        {t("register", { ns: "common" })}
                      </Button>
                      <p>{t("footer", { ns: "registration" })}</p>
                    </Segment>
                  </Grid.Column>
                </Grid>
          <Grid stackable columns={2}>
            <Grid.Column>
              <Segment className="form-background-color">
                <SearchCustomerByIdForm />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment className="fill-height form-background-color">
                <Header
                  as="h2"
                  content={t("header", { ns: "create_customer" })}
                  className="modal-text-color"
                  textAlign="center"
                />

                <Button
                  onClick={() => modalStore.openModal(<CreateCustomerForm />)}
                  size="huge"
                  positive
                >
                  {t("createCustomer", { ns: "common" })}
                </Button>
                <p>{t("footer", { ns: "create_customer" })}</p>
              </Segment>
            </Grid.Column>
          </Grid>
          <Grid stackable columns={1}>
          <Grid.Column>
            {customersToDisplay.length ? <h1>All Customers</h1> : null}
            <Grid className="form-background-color scrollable-container" columns={2}>
              {customersToDisplay && customersToDisplay.map(c => (
                <Grid.Column key={c.id}>
                  <CustomerCard customerDetails={c} />
                </Grid.Column>
              ))}
            </Grid>
          </Grid.Column>
          </Grid>
                {/* <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                                  {t("login", {ns: "common"})}
                              </Button> */}
                {/* > */}
              </>
            </>
          )}
        </Container>
 
      </Segment>
      {/* <Segment textAlign="center" vertical className="masthead">

      </Segment> */}
    </>
  );
});
