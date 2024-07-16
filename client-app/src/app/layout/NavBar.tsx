import { observer } from "mobx-react-lite";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import {  Container,  Menu,  Image,  Dropdown } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { useTranslation } from "react-i18next";

export default observer(function NavBar() {
  const {
    userStore: { user, logout, isLoggedIn },
  } = useStore();
  const { t } = useTranslation(['common', "users"]);

  return (
    <Menu inverted fixed="top" secondary stackable>
      <Container className="full-width">
      <Image
            size="massive"
            src="/assets/logo_rtlg.png"
            alt="logo"
            style={{ width: 140, marginBottom: 2 }}
          />
        {!isLoggedIn && t("login.learn_more", {ns: "users"})}
        {isLoggedIn ? (
          <>
            <Menu.Item as={Link} to="/dashboard" name={t("links.dashboard", {ns: "common"})} icon="dashboard" />
            <Menu.Item position="right" >
              <Dropdown direction='left' text={user?.firstName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/users/changepassword/${user?.id}`}
                    text={t("password.change", {ns: "users"})}
                    />
                  <Dropdown.Item
                    onClick={logout}
                    text={t("logout", {ns: "common"})}
                    icon="power"
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item position="right" className="navbar-color">
            {" "}
            {t("login.application_online",{ns: "users"})}{" "}
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
});
