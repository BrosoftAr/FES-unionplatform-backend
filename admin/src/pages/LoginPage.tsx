import React from "react";
import { Card } from "antd";
import Login from "../components/Admin/Login";

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
