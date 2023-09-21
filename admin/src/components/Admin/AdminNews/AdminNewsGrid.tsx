import React from "react";
import { Button, Table, Card, Tooltip, message } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLS from "../../../shared/urls";
import useNews from "../../../shared/hooks/useNews";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";

const AdminNewsGrid = () => {
  const { news, isLoadingNews, fetchNews } = useNews({});

  const testNotification = async () =>
    await FetchService.request(ApiEndpoints.NEWS_TEST_NOTIFICATION);

  return (
    <Card
      title="Noticias"
      extra={
        <>
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            onClick={testNotification}
            style={{ marginRight: "10px" }}
          >
            Simular notificación
          </Button>
          <Link to={URLS.ADMIN_NEWS_NEW}>
            <Button icon={<PlusCircleOutlined />} type="primary">
              Agregar Noticia
            </Button>
          </Link>
        </>
      }
    >
      <Table
        loading={isLoadingNews}
        dataSource={news}
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
            render(newsId) {
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
                          "Esta seguro de querer eliminar esta noticia?"
                        );
                        if (confirm) {
                          const closeLoading = message.loading(
                            "Eliminando noticia...",
                            0
                          );
                          await FetchService.request(ApiEndpoints.NEWS_REMOVE, {
                            body: JSON.stringify({ newsId }),
                          });
                          closeLoading();
                          message.success("Noticia eliminada");
                          fetchNews();
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Editar">
                    <Link to={URLS.ADMIN_NEWS_EDIT.replace(":_id", newsId)}>
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
export default AdminNewsGrid;
