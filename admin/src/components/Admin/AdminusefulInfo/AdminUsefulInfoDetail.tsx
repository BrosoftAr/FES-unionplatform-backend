import React, { useState, useEffect } from "react";
import { Card, Form, Input, Row, Col, Button, message, Spin } from "antd";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URLS from "../../../shared/urls";
import { UsefulInfo } from "../../../shared/UsefulInfo";
import HtmlEditor from "../../HtmlEditor";

interface UsefulInfoFormValues {
  title: string;
  description: string;
  content: string;
}

interface AdminUsefulInfoDetailRouteParams {
  _id?: string;
}

const AdminUsefulInfoDetail: React.FunctionComponent<RouteComponentProps<
  AdminUsefulInfoDetailRouteParams
>> = ({ match, history }) => {
  const isEditing = !!match.params && match.params._id;
  const usefulInfoId = isEditing && match.params._id;

  const [form] = Form.useForm();

  const [isSending, setIsSending] = useState(false);
  const saveForm = async (values: any) => {
    setIsSending(true);
    try {
      const formValues: UsefulInfoFormValues = values;

      const endpoint = isEditing
        ? ApiEndpoints.USEFUL_INFO_EDIT
        : ApiEndpoints.USEFUL_INFO_ADD;
        
      await FetchService.request(endpoint, {
        body: JSON.stringify({
          usefulInfoValues: formValues,
          usefulInfoId,
        }),
      });
      form.resetFields();
      message.success(
        isEditing ? "Información Útil actualizada" : "Información Útil guardada"
      );

      history.push(URLS.ADMIN_USEFUL_INFO);
    } catch (e) {
      message.error(JSON.stringify(e));
    } finally {
      setIsSending(false);
    }
  };

  const [usefulInfo, setUsefulInfo] = useState<UsefulInfo>();
  const [isLoadingUsefulInfo, setIsLoadingUsefulInfo] = useState(true);

  useEffect(() => {
    const fetchUsefulInfo = async () => {
      setIsLoadingUsefulInfo(true);
      const { usefulInfo: newUsefulInfo } = await FetchService.request(ApiEndpoints.USEFUL_INFO_DETAIL, {
        body: JSON.stringify({ usefulInfoId }),
      });
      setUsefulInfo(newUsefulInfo);
      setIsLoadingUsefulInfo(false);
    };

    if (isEditing) {
      fetchUsefulInfo();
    }
  }, [isEditing, usefulInfoId]);

  const isLoading = isEditing && isLoadingUsefulInfo;

  if (isLoading) {
    return <Spin />;
  }

  let initialValues: UsefulInfoFormValues | undefined = undefined;
  if (usefulInfo && isEditing) {
    initialValues = {
      title: usefulInfo.title,
      content: usefulInfo.content,
      description: usefulInfo.description,
    };
  }

  return (
    <Card title={<BackCardTitle title="Agregar Información Útil" />}>
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

            <Form.Item label="Descripción corta" name="description" rules={[{ required: true }]}>
              <Input autoFocus />
            </Form.Item>

            <Form.Item label="Contenido" name="content" rules={[{ required: true }]}>
              <HtmlEditor />
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
export default withRouter(AdminUsefulInfoDetail);
