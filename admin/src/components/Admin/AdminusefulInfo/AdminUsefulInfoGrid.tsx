import React from "react";
import { Button, Table, Card, Tooltip, message } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLS from "../../../shared/urls";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import useUsefulInfo from "../../../shared/hooks/useUsefulInfo";

const AdminUsefulInfoGrid = () => {
  const { usefulInfo, isLoadingUsefulInfo, fetchUsefulInfo } = useUsefulInfo();

  return (
    <Card
      title="Información Útil"
      extra={
        <Link to={URLS.ADMIN_USEFUL_INFO_NEW}>
          <Button icon={<PlusCircleOutlined />} type="primary">
            Agregar Información Útil
          </Button>
        </Link>
      }
    >
      <Table
        loading={isLoadingUsefulInfo}
        dataSource={usefulInfo}
        columns={[
          {
            title: "Fecha",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200,
          },
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
            render(usefulInfoId) {
              return (
                <>
                  <Tooltip title="Eliminar">
                    <Button
                      style={{ marginRight: 5 }}
                      type="primary"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={async () => {
                        const confirm = window.confirm(
                          "Esta seguro de querer eliminar esta Información Útil?"
                        );
                        if (confirm) {
                          const closeLoading = message.loading(
                            "Eliminando Información Útil...",
                            0
                          );
                          await FetchService.request(ApiEndpoints.USEFUL_INFO_REMOVE, {
                            body: JSON.stringify({ usefulInfoId }),
                          });
                          closeLoading();
                          message.success("Información Útil eliminada");
                          fetchUsefulInfo();
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Editar">
                    <Link to={URLS.ADMIN_USEFUL_INFO_EDIT.replace(":_id", usefulInfoId)}>
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
export default AdminUsefulInfoGrid;
