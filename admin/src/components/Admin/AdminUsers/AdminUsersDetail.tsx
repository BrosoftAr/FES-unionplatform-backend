import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Button,
  message,
  Spin,
  Select,
} from "antd";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URLS from "../../../shared/urls";
import { User } from "../../../shared/User";
import { RolesEnum } from "../../../shared/roles";

interface UsersFormValues {
  username: string;
  password: string;
  role: string;
}

interface AdminUsersDetailRouteParams {
  _id?: string;
}

const AdminUsersDetail: React.FunctionComponent<RouteComponentProps<
  AdminUsersDetailRouteParams
>> = ({ match, history }) => {
  const isEditing = !!match.params && match.params._id;
  const userId = isEditing && match.params._id;

  const [form] = Form.useForm();

  const [isSending, setIsSending] = useState(false);
  const saveForm = async (values: any) => {
    setIsSending(true);
    try {
      const formValues: UsersFormValues = values;

      const endpoint = isEditing
        ? ApiEndpoints.USERS_EDIT
        : ApiEndpoints.USERS_ADD;
      await FetchService.request(endpoint, {
        body: JSON.stringify({
          userValues: formValues,
          userId,
        }),
      });
      form.resetFields();
      message.success(isEditing ? "Usuario actualizado" : "Usuario guardado");

      history.push(URLS.ADMIN_USERS);
    } catch (e) {
      message.error(JSON.stringify(e));
    } finally {
      setIsSending(false);
    }
  };

  const [user, setUser] = useState<User>();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      const { user } = await FetchService.request(ApiEndpoints.USERS_DETAIL, {
        body: JSON.stringify({ userId }),
      });
      setUser(user);
      setIsLoadingUser(false);
    };

    if (isEditing) {
      fetchUser();
    }
  }, [isEditing, userId]);

  const isLoading = isEditing && isLoadingUser;

  if (isLoading) {
    return <Spin />;
  }

  let initialValues: UsersFormValues | undefined = {
    role: RolesEnum.REPORTER,
    username: "",
    password: "",
  };
  if (user && isEditing) {
    initialValues = {
      username: user.username,
      password: "",
      role: user.role,
    };
  }

  return (
    <Card title={<BackCardTitle title="Agregar Usuario" />}>
      <Row>
        <Col span={16} offset={4}>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={saveForm}
            initialValues={initialValues}
          >
            <Form.Item label="Rol" name="role" rules={[{ required: true }]}>
              <Select>
                {Object.values(RolesEnum).map((role) => (
                  <Select.Option value={role}>{role}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Nombre de usuario"
              name="username"
              rules={[{ required: true }]}
            >
              <Input autoFocus />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isSending}
                loading={isSending}
              >
                Guardar
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};
export default withRouter(AdminUsersDetail);
