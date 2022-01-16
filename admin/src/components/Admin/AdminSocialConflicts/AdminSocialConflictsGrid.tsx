import React, { useState } from "react";
import moment from "moment";
import Media from "react-media";
import { Button, Table, Card, Tooltip, message, Input } from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLS from "../../../shared/urls";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import { DATE_TIME_FORMAT } from "../../../shared/config";
import useSocialConflicts from "../../../shared/hooks/useSocialConflicts";

const AdminSocialConflictsGrid = () => {
  const [searchFilter, setSearchFilter] = useState<string>();
  const {
    socialConflicts,
    isLoadingSocialConflicts,
    fetchSocialConflicts,
  } = useSocialConflicts({
    searchFilter,
  });

  const removeSocialConflict = async ({
    socialConflictId,
  }: {
    socialConflictId: string;
  }) => {
    if (window.confirm("Esta seguro de eliminar este conflicto?")) {
      const closeLoadingMessage = message.loading("Borrando conflicto...");
      await FetchService.request(ApiEndpoints.SOCIAL_CONFLICTS_REMOVE, {
        body: JSON.stringify({ socialConflictId }),
      });
      fetchSocialConflicts();
      closeLoadingMessage();
    }
  };

  const columns = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Lugar/Dirección",
      dataIndex: "location",
      key: "location",
      render(location: any) {
        return location ? location.description : "";
      },
    },
    {
      width: 200,
      title: "Fecha creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render(createdAt: Date) {
        return createdAt ? moment(createdAt).format(DATE_TIME_FORMAT) : "N/A";
      },
      hideOnSmall: true,
    },
    {
      title: "Acciones",
      key: "actions",
      dataIndex: "_id",
      width: 90,
      render(socialConflictId: string) {
        return (
          <>
            <Tooltip title="Eliminar">
              <Button
                style={{ marginRight: 5 }}
                type="primary"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => removeSocialConflict({ socialConflictId })}
              />
            </Tooltip>
            <Tooltip title="Editar">
              <Link
                to={URLS.ADMIN_CONFLICTS_EDIT.replace(":_id", socialConflictId)}
              >
                <Button type="default" size="small" icon={<EditOutlined />} />
              </Link>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const getResponsiveColumns = (smallScreen: boolean) =>
    columns.filter(({ hideOnSmall = false }) => !(smallScreen && hideOnSmall));

  return (
    <Card
      title="Conflictos"
      extra={
        <Link to={URLS.ADMIN_CONFLICTS_NEW}>
          <Button icon={<PlusCircleOutlined />} type="primary">
            Agregar Conflicto
          </Button>
        </Link>
      }
    >
      <div style={{ marginBottom: 20 }}>
        <Input.Search
          placeholder="Buscar..."
          enterButton={<SearchOutlined />}
          onSearch={(searchStr) => setSearchFilter(searchStr)}
        />
      </div>
      <Media query="(max-width: 768px)">
        {(smallScreen) => (
          <Table
            pagination={{
              defaultPageSize: 50,
            }}
            loading={isLoadingSocialConflicts}
            dataSource={socialConflicts}
            rowKey="_id"
            columns={getResponsiveColumns(smallScreen)}
          />
        )}
      </Media>
    </Card>
  );
};
export default AdminSocialConflictsGrid;
