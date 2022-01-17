import React from "react";
import { Button, Table, Card, Tooltip } from "antd";
import {
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLS from "../../../shared/urls";
import useIncidents from "../../../shared/hooks/useIncidents";
import { IncidentStatusLabel } from "../../../shared/Incident";

const AdminIncidentsGrid = () => {
  const { incidents, isLoadingIncidents } = useIncidents({});

  return (
    <Card title="Incidentes">
      <Table
        loading={isLoadingIncidents}
        dataSource={incidents}
        columns={[ 
          {
            title: "Fecha",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200,
          },
          {
            title: "Situación",
            dataIndex: "situation",
            key: "situation",
          },
          {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            render(status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED") {
              return <span>{IncidentStatusLabel[status]}</span>
            }
          },
          {
            width: 90,
            title: "Acciones",
            key: "actions",
            dataIndex: "_id",
            render(newsId) {
              return (
                <>
                  <Tooltip title="Editar">
                    <Link to={URLS.ADMIN_INCIDENTS_EDIT.replace(":_id", newsId)}>
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
export default AdminIncidentsGrid;
