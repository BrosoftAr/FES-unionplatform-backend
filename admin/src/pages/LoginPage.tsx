import React from "react";
import Login from "../components/Admin/Login";
import { Card } from "antd";

const LoginPage = () => {
  return (
    <div
      style={{
        background: "#ddd",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Card title="Login" style={{ maxWidth: 500 }}>
        <Login />
      </Card>
    </div>
  );
};
export default LoginPage;
