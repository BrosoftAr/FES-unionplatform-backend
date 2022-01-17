import React from "react";
import { Button, Table, Card, Tooltip } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLS from "../../../shared/urls";
import useUsers from "../../../shared/hooks/useUsers";
import AuthService from "../../../shared/AuthService";
import { RolesEnum } from "../../../shared/roles";

const AdminUsersGrid = () => {
  const { users, isLoadingUsers } = useUsers();
  const role = AuthService.getCurrentRole();

  return (
    <Card
      title="Usuarios"
      extra={
        <div>
          {role === RolesEnum.ADMIN && (
            <Link to={URLS.ADMIN_USERS_NEW}>
              <Button icon={<PlusCircleOutlined />} type="primary">
                Agregar Usuario 
              </Button>
            </Link>
          )}
        </div> 
      }
    >
      <Table
        loading={isLoadingUsers}
        dataSource={users}
        columns={[
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Verificado",
            dataIndex: "isVerified",
            key: "isVerified",
            render(isVerified){
              return isVerified ? "Si" : "No";
            }
          },
          {
            width: 200,
            title: "Acciones",
            key: "actions",
            dataIndex: "_id",
            render(userId) {
              return (
                <>
                  <Tooltip title="Eliminar">
                    <Button
                      style={{ marginRight: 5 }}
                      type="primary"
                      size="small"
                      icon={<DeleteOutlined />}
                    />
                  </Tooltip>
                  <Tooltip title="Editar">
                    <Link to={URLS.ADMIN_USERS_EDIT.replace(":_id", userId)}>
                      <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                      />
                    </Link>
                  </Tooltip>
                </>
              );
            },
          },
        ]}
      />
    </Card>
  );
};
export default AdminUsersGrid;
