import React from "react";
import { Redirect } from "react-router-dom";
import URLS from "../../shared/urls";

const AdminHomePage = () => {
  return <Redirect to={URLS.ADMIN_USERS} />;
};
export default AdminHomePage;
