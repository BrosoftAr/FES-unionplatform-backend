import React from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import URLS from "../shared/urls";
import AdminHomePage from "../components/Admin/AdminHomePage";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminCategoriesGrid from "../components/Admin/AdminCategories/AdminCategoriesGrid";
import AdminCategoriesDetail from "../components/Admin/AdminCategories/AdminCategoriesDetail";
import AdminUsersGrid from "../components/Admin/AdminUsers/AdminUsersGrid";
import AdminUsersDetail from "../components/Admin/AdminUsers/AdminUsersDetail";
import AdminUnionsGrid from "../components/Admin/AdminUnions/AdminUnionsGrid";
import AdminUnionsDetail from "../components/Admin/AdminUnions/AdminUnionsDetail";
import AdminSocialConflictsGrid from "../components/Admin/AdminSocialConflicts/AdminSocialConflictsGrid";
import AdminSocialConflictsDetail from "../components/Admin/AdminSocialConflicts/AdminSocialConflictsDetail";

const AdminPage = () => (
  <Layout>
    <Layout.Header>
      <div className="container">
        <AdminHeader />
      </div>
    </Layout.Header>
    <Layout.Content style={{ paddingTop: 20 }}>
      <div className="container">
        <Switch>
          <Route exact path={URLS.ADMIN} component={AdminHomePage} />

          {/* Users */}
          <Route exact path={URLS.ADMIN_USERS} component={AdminUsersGrid} />
          <Route
            exact
            path={URLS.ADMIN_USERS_NEW}
            component={AdminUsersDetail}
          />
          <Route
            exact
            path={URLS.ADMIN_USERS_EDIT}
            component={AdminUsersDetail}
          />

          {/* SocialConflicts */}
          <Route
            exact
            path={URLS.ADMIN_CONFLICTS}
            component={AdminSocialConflictsGrid}
          />
          <Route
            exact
            path={URLS.ADMIN_CONFLICTS_NEW}
            component={AdminSocialConflictsDetail}
          />
          <Route
            exact
            path={URLS.ADMIN_CONFLICTS_EDIT}
            component={AdminSocialConflictsDetail}
          />

          {/* Categories */}
          <Route
            exact
            path={URLS.ADMIN_CATEGORIES}
            component={AdminCategoriesGrid}
          />
          <Route
            exact
            path={URLS.ADMIN_CATEGORIES_NEW}
            component={AdminCategoriesDetail}
          />
          <Route
            exact
            path={URLS.ADMIN_CATEGORIES_EDIT}
            component={AdminCategoriesDetail}
          />

          {/* Unions */}
          <Route exact path={URLS.ADMIN_UNIONS} component={AdminUnionsGrid} />
          <Route
            exact
            path={URLS.ADMIN_UNIONS_NEW}
            component={AdminUnionsDetail}
          />
          <Route
            exact
            path={URLS.ADMIN_UNIONS_EDIT}
            component={AdminUnionsDetail}
          />
        </Switch>
      </div>
    </Layout.Content>
  </Layout>
);

export default AdminPage;
