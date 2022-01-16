import React, { useState, useEffect } from "react";
import { Card, Form, Input, Row, Col, Button, message, Spin } from "antd";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URLS from "../../../shared/urls";
import { Category } from "../../../shared/Category";

interface CategoryFormValues {
  title: string;
}

interface AdminCategoriesDetailRouteParams {
  _id?: string;
}

const AdminCategoriesDetail: React.FunctionComponent<RouteComponentProps<
  AdminCategoriesDetailRouteParams
>> = ({ match, history }) => {
  const isEditing = !!match.params && match.params._id;
  const categoryId = isEditing && match.params._id;

  const [form] = Form.useForm();

  const [isSending, setIsSending] = useState(false);
  const saveForm = async (values: any) => {
    setIsSending(true);
    try {
      const formValues: CategoryFormValues = values;

      const endpoint = isEditing
        ? ApiEndpoints.CATEGORIES_EDIT
        : ApiEndpoints.CATEGORIES_ADD;
      await FetchService.request(endpoint, {
        body: JSON.stringify({
          categoryValues: formValues,
          categoryId,
        }),
      });
      form.resetFields();
      message.success(isEditing ? "Sector actualizado" : "Sector guardado");

      // history.push(URLS.ADMIN_CATEGORIES);
    } catch (e) {
      message.error(JSON.stringify(e));
    } finally {
      setIsSending(false);
    }
  };

  const [category, setCategory] = useState<Category>();
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoadingCategory(true);
      const { category } = await FetchService.request(
        ApiEndpoints.CATEGORIES_DETAIL,
        {
          body: JSON.stringify({ categoryId }),
        }
      );
      setCategory(category);
      setIsLoadingCategory(false);
    };

    if (isEditing) {
      fetchCategory();
    }
  }, [isEditing, categoryId]);

  const isLoading = isEditing && isLoadingCategory;

  if (isLoading) {
    return <Spin />;
  }

  let initialValues: CategoryFormValues | undefined = undefined;
  if (category && isEditing) {
    initialValues = {
      title: category.title,
    };
  }

  return (
    <Card title={<BackCardTitle title="Agregar sector" />}>
      <Row>
        <Col span={16} offset={4}>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={saveForm}
            initialValues={initialValues}
          >
            <Form.Item label="Título" name="title" rules={[{ required: true }]}>
              <Input autoFocus />
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
export default withRouter(AdminCategoriesDetail);
