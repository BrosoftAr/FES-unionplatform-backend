import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import URLS from "../shared/urls";

const AuthenticatedRoute = (params: RouteProps) => {
  if (!localStorage.getItem("token")) {
    return <Redirect to={URLS.LOGIN} />;
  }

  return <Route {...params} />;
};

export default AuthenticatedRoute;
