import React from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import URLS from "../shared/urls";
import AdminHomePage from "../components/Admin/AdminHomePage";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminUsersGrid from "../components/Admin/AdminUsers/AdminUsersGrid";
import AdminUsersDetail from "../components/Admin/AdminUsers/AdminUsersDetail";
import AdminNewsGrid from "../components/Admin/AdminNews/AdminNewsGrid";
import AdminNewsDetail from "../components/Admin/AdminNews/AdminNewsDetail";

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


          {/* Categories */}
          {/* <Route
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
          /> */}

          {/* News */}
          <Route exact path={URLS.ADMIN_NEWS} component={AdminNewsGrid} />
          <Route
            exact
            path={URLS.ADMIN_NEWS_NEW}
            component={AdminNewsDetail}
          />
          <Route
            exact
            path={URLS.ADMIN_NEWS_EDIT}
            component={AdminNewsDetail}
          />
        </Switch>
      </div>
    </Layout.Content>
  </Layout>
);

export default AdminPage;
