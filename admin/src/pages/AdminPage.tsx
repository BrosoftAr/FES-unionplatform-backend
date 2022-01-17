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
import AdminUsefulInfoGrid from "../components/Admin/AdminusefulInfo/AdminUsefulInfoGrid";
import AdminUsefulInfoDetail from "../components/Admin/AdminusefulInfo/AdminUsefulInfoDetail";
import AdminIncidentsGrid from "../components/Admin/AdminIncidents/AdminIncidentsGrid";
import AdminIncidentsDetail from "../components/Admin/AdminIncidents/AdminIncidentsDetail";

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


          {/* Useful Information */}
          <Route exact path={URLS.ADMIN_USEFUL_INFO} component={AdminUsefulInfoGrid} />
          <Route
            exact
            path={URLS.ADMIN_USEFUL_INFO_NEW}
            component={AdminUsefulInfoDetail}
          />
          <Route
            exact
            path={URLS.ADMIN_USEFUL_INFO_EDIT}
            component={AdminUsefulInfoDetail}
          />

          {/* Incidents */}
          <Route exact path={URLS.ADMIN_INCIDENTS} component={AdminIncidentsGrid} />
          <Route
            exact
            path={URLS.ADMIN_INCIDENTS_EDIT}
            component={AdminIncidentsDetail}
          />
        </Switch>
      </div>
    </Layout.Content>
  </Layout>
);

export default AdminPage;
