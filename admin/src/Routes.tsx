import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import URLS from "./shared/urls";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import AuthenticatedRoute from "./components/LoggedInRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <>
        <Switch>
          <AuthenticatedRoute path={URLS.ADMIN} component={AdminPage} />
          <Route path={URLS.LOGIN} component={LoginPage} />
        </Switch>
      </>
    </BrowserRouter>
  );
};
export default Routes;
