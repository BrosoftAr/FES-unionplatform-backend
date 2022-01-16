import React from "react";
import { Button, Table, Card, Tooltip } from "antd";
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLS from "../../../shared/urls";
import useUnions from "../../../shared/hooks/useUnions";

const AdminUnionsGrid = () => {
  const { unions, isLoadingUnions } = useUnions();

  return (
    <Card
      title="Sindicatos"
      extra={
        <Link to={URLS.ADMIN_UNIONS_NEW}>
          <Button icon={<PlusCircleOutlined />} type="primary">
            Agregar Sindicato
          </Button>
        </Link>
      }
    >
      <Table
        loading={isLoadingUnions}
        dataSource={unions}
        columns={[
          {
            title: "Título",
            dataIndex: "title",
            key: "title",
          },
          {
            width: 90,
            title: "Acciones",
            key: "actions",
            dataIndex: "_id",
            render(unionId) {
              return (
                <>
                  <Tooltip title="Editar">
                    <Link to={URLS.ADMIN_UNIONS_EDIT.replace(":_id", unionId)}>
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
export default AdminUnionsGrid;
