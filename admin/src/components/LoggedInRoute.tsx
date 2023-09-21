import React, { useEffect } from "react";
import { Route, RouteProps, useHistory } from "react-router-dom";
import URLS from "../shared/urls";

const AuthenticatedRoute = (params: RouteProps) => {
  const history = useHistory();

  useEffect(() => {
    const checkUserData = () => {
      const token = localStorage.getItem("token");
      if (!token) history.push(URLS.LOGIN);
    };

    window.addEventListener("storage", checkUserData);

    return () => window.removeEventListener("storage", checkUserData);
  }, []);

  return <Route {...params} />;
};

export default AuthenticatedRoute;
