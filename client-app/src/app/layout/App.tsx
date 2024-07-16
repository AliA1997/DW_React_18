import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { useLocation, Route, Routes } from "react-router-dom";
// import { Routes, Route, CompatRoute } from 'react-router-dom-v5-compat';
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import RegisterSuccess from "../../features/users/registration/RegisterSuccess";
import ConfirmEmail from "../../features/users/registration/ConfirmEmail";
import { useTranslation } from "react-i18next";
import "../../app/common/i18n/i18n.ts";
import ChangePassword from "../../features/users/passwordchange/ChangePassword";
import ForgotPassword from "../../features/users/passwordchange/ForgotPassword";
import Details from "../../features/users/form/Details";
import Footer from "./Footer";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();
  const { t } = useTranslation(["common", "translation"]);

  // const { getUser } = userStore;
  //const { token, setAppLoaded } = commonStore;

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      //   userStore.getFacebookLoginStatus().then(() =>
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content={t("loading", { ns: "common" })} />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      <>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path={"/(.+)"}
            element={
              <Container style={{ marginTop: "7em" }}>
                <Routes>
                  {/* <PrivateRoute
                    exact
                    path="/tickets"
                    component={TicketDashboard}
                  />
                  <PrivateRoute
                    exact
                    path="/subscription"
                    component={SubscpritionContent}
                  />
                  <PrivateRoute path="/tickets/:id" component={TicketDetails} /> */}
                  {/* <PrivateRoute path="/dashboard" component={Dashboard} /> */}
                  <PrivateRoute
                    path="/profiles/:username"
                    component={ProfilePage}
                  />
                  <PrivateRoute
                    path="/users/changePassword/:id"
                    component={ChangePassword}
                  />
                  <Route path="/server-error" element={<ServerError />} />
                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                  <Route
                    path="/account/registerSuccess"
                    element={<RegisterSuccess />}
                  />
                  <Route
                    path="/account/verifyEmail"
                    element={<ConfirmEmail />}
                  />
                  <Route path="/userdetails" element={<Details />} />
                  <Route element={<NotFound />} />
                </Routes>
              </Container>
            }
          />
        </Routes>
        {/* <Footer /> */}
      </>
    </>
  );
}

export default observer(App);
