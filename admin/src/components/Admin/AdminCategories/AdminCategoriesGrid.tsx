import React from "react";
import { Button, Table, Card, Tooltip } from "antd";
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import URLS from "../../../shared/urls";
import useCategories from "../../../shared/hooks/useCategories";

const AdminCategoriesGrid = () => {
  const { categories, isLoadingCategories } = useCategories();

  return (
    <Card
      title="Sectores"
      extra={
        // <Link to={URLS.ADMIN_CATEGORIES_NEW}>
          <Button icon={<PlusCircleOutlined />} type="primary">
            Agregar Sector
          </Button>
        // </Link>
      }
    >
      <Table
        loading={isLoadingCategories}
        dataSource={categories}
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
            render(categoryId) {
              return (
                <>
                  <Tooltip title="Editar">
                    {/* <Link
                      to={URLS.ADMIN_CATEGORIES_EDIT.replace(
                        ":_id", 
                        categoryId
                      )}
                    >
                      <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                      />
                    </Link> */}
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
export default AdminCategoriesGrid;
