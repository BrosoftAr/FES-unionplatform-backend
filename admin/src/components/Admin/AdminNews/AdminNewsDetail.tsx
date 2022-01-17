import React, { useState, useEffect, useMemo } from "react";
import { Card, Form, Input, Row, Col, Button, message, Spin } from "antd";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URLS from "../../../shared/urls";
import { News } from "../../../shared/News";
import HtmlEditor from "../../HtmlEditor";

interface NewsFormValues {
  title: string;
  description: string;
  thumbnail: string;
  content: string;
}

interface AdminNewsDetailRouteParams {
  _id?: string;
}



const AdminNewsDetail: React.FunctionComponent<RouteComponentProps<
  AdminNewsDetailRouteParams
>> = ({ match, history }) => {

  const isEditing = !!match.params && match.params._id;
  const newsId = isEditing && match.params._id;

  const [form] = Form.useForm();

  const [isSending, setIsSending] = useState(false);
  const saveForm = async (values: any) => {
    setIsSending(true);
    try {
      const formValues: NewsFormValues = values;

      const endpoint = isEditing
        ? ApiEndpoints.NEWS_EDIT
        : ApiEndpoints.NEWS_ADD;

      await FetchService.request(endpoint, {
        body: JSON.stringify({
          newsValues: formValues,
          newsId,
        }),
      });
      form.resetFields();
      message.success(isEditing ? "Noticia actualizada" : "Noticia guardada");

      history.push(URLS.ADMIN_NEWS);
    } catch (e) {
      message.error(JSON.stringify(e));
    } finally {
      setIsSending(false);
    }
  };

  const [news, setNews] = useState<News>();
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoadingNews(true);
      const { news } = await FetchService.request(ApiEndpoints.NEWS_DETAIL, {
        body: JSON.stringify({ newsId }),
      });
      setNews(news);
      setIsLoadingNews(false);
    };

    if (isEditing) {
      fetchNews();
    }
  }, [isEditing, newsId]);

  const isLoading = isEditing && isLoadingNews;

  if (isLoading) {
    return <Spin />;
  }

  let initialValues: NewsFormValues | undefined = undefined;
  if (news && isEditing) {
    initialValues = {
      title: news.title,
      content: news.content,
      description: news.description,
      thumbnail: news.thumbnail,
    };
  }

  return (
    <Card title={<BackCardTitle title="Agregar noticia" />}>
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

            <Form.Item
              label="Descripción corta"
              name="description"
              rules={[{ required: true }]}
            >
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              label="URL de Imagen"
              name="thumbnail"
              rules={[{ required: true }]}
            >
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              label="Contenido"
              name="content"
              rules={[{ required: true }]}
            >
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
export default withRouter(AdminNewsDetail);
