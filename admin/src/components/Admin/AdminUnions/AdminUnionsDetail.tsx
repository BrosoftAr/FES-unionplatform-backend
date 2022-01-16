import React, { useState, useEffect } from "react";
import { Card, Form, Input, Row, Col, Button, message, Spin } from "antd";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URLS from "../../../shared/urls";
import { Union } from "../../../shared/Union";

interface UnionFormValues {
  title: string;
}

interface AdminUnionsDetailRouteParams {
  _id?: string;
}

const AdminUnionsDetail: React.FunctionComponent<RouteComponentProps<
  AdminUnionsDetailRouteParams
>> = ({ match, history }) => {
  const isEditing = !!match.params && match.params._id;
  const unionId = isEditing && match.params._id;

  const [form] = Form.useForm();

  const [isSending, setIsSending] = useState(false);
  const saveForm = async (values: any) => {
    setIsSending(true);
    try {
      const formValues: UnionFormValues = values;

      const endpoint = isEditing
        ? ApiEndpoints.UNIONS_EDIT
        : ApiEndpoints.UNIONS_ADD;
      await FetchService.request(endpoint, {
        body: JSON.stringify({
          unionValues: formValues,
          unionId,
        }),
      });
      form.resetFields();
      message.success(
        isEditing ? "Sindicato actualizado" : "Sindicato guardado"
      );

      history.push(URLS.ADMIN_UNIONS);
    } catch (e) {
      message.error(JSON.stringify(e));
    } finally {
      setIsSending(false);
    }
  };

  const [union, setUnion] = useState<Union>();
  const [isLoadingUnion, setIsLoadingUnion] = useState(true);

  useEffect(() => {
    const fetchUnion = async () => {
      setIsLoadingUnion(true);
      const { union } = await FetchService.request(ApiEndpoints.UNIONS_DETAIL, {
        body: JSON.stringify({ unionId }),
      });
      setUnion(union);
      setIsLoadingUnion(false);
    };

    if (isEditing) {
      fetchUnion();
    }
  }, [isEditing, unionId]);

  const isLoading = isEditing && isLoadingUnion;

  if (isLoading) {
    return <Spin />;
  }

  let initialValues: UnionFormValues | undefined = undefined;
  if (union && isEditing) {
    initialValues = {
      title: union.title,
    };
  }

  return (
    <Card title={<BackCardTitle title="Agregar sindicato" />}>
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
export default withRouter(AdminUnionsDetail);
