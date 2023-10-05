import React, { useState } from "react";
import { Input, Form, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import FetchService from "../../shared/fetchService";
import ApiEndpoints from "../../shared/ApiEndpoints";
import AuthService from "../../shared/AuthService";
import URLS from "../../shared/urls";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { md: { offset: 8, span: 16 } },
  };

  const onFinish = async (values: any) => {
    try {
      setIsSubmitting(true);
      const { password, email }: FormValues = values;
      const { token } = await FetchService.request(ApiEndpoints.LOGIN, {
        body: JSON.stringify({ email, password, admin: true }),
      });
      AuthService.saveAuthToken(token);
      message.success("Login exitoso");
      history.push(URLS.ADMIN);
    } catch (e: String | any) {
      message.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Ingresa tu email" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: "Ingresa tu contraseña" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Login;
