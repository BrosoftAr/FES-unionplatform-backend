import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Button,
  message,
  Spin,
  Upload,
} from "antd";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import URLS from "../../../shared/urls";
import { News } from "../../../shared/News";
import HtmlEditor from "../../HtmlEditor";

interface NewsFormValues {
  title: string;
  description: string;
  content: string;
  scope: string;
}

interface AdminNewsDetailRouteParams {
  _id?: string;
}

interface FileItem {
  uid: string;
  name: string;
  status: "uploading" | "done";
  url: string;
  fileKey: string;
}

const AdminNewsDetail: React.FunctionComponent<RouteComponentProps<
  AdminNewsDetailRouteParams
>> = ({ match, history }) => {
  const isEditing = !!match.params && match.params._id;
  const newsId = isEditing && match.params._id;
  const [fileItem, setFileItem] = useState<FileItem>();

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
          newsValues: {
            ...formValues,
            thumbnail: {
              fileKey: fileItem?.fileKey,
              fileName: fileItem?.name,
            },
          },
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
      if (news.thumbnail && typeof news.thumbnail !== "string") {
        setFileItem({
          uid: news.thumbnail.fileName,
          name: news.thumbnail.fileName,
          status: "done",
          url: news.thumbnail.url,
          fileKey: news.thumbnail.fileKey,
        });
      }
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

  let initialValues: NewsFormValues | undefined;
  if (news && isEditing) {
    initialValues = {
      title: news.title,
      content: news.content,
      description: news.description,
      scope: news.scope,
    };
  }

  // const imageUrl = news?.thumbnail;

  const getImageToken = async (fileName: string) => {
    const response = await FetchService.request(
      ApiEndpoints.GET_IMAGE_UPLOAD_TOKEN,
      {
        body: JSON.stringify({
          fileName,
        }),
      }
    );
    return response;
  };

  const onUpload = async (file: any) => {
    const fileName: string = file.name;

    const newFile: FileItem = {
      uid: fileName,
      name: fileName,
      status: "uploading",
      url: "",
      fileKey: "",
    };

    setFileItem(newFile);

    const { url, fields } = await getImageToken(fileName);
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
    
    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      console.log("Uploaded successfully!");
      const fileKey = fields.key;
      newFile.status = "done";
      newFile.url = `${url}${fileKey}`;
      newFile.fileKey = fileKey;

      setFileItem(newFile);
    } else {
      console.error("Upload failed.");
      message.error(
        "Hubo un problema con la carga del archivo. Intente nuevamente. "
      );
    }

    return false;
  };

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
              label="Imagen"
              name="thumbnail"
              rules={[{ required: true }]}
            >
              <Upload
                name="images"
                listType="picture"
                beforeUpload={onUpload as any}
                fileList={(fileItem ? [fileItem] : []) as any}
                onRemove={() => setFileItem(undefined)}
                // maxCount={1}
              >
                {!fileItem && (
                  <Button icon={<UploadOutlined />}>Elegir imagen</Button>
                )}
              </Upload>
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
