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
  Select,
  DatePicker,
  Tooltip,
  Checkbox,
  InputNumber,
} from "antd";
import { get } from "lodash";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import { RouteComponentProps, withRouter, useLocation } from "react-router-dom";
import { SocialConflict } from "../../../shared/SocialConflict";
import URLS from "../../../shared/urls";
import {
  antagonistsEnum,
  antagonistsLabelsEnum,
} from "../../../shared/antagonists";
import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { DATE_FORMAT } from "../../../shared/config";
import {
  actionTypeEnum,
  actionTypeLabelsEnum,
} from "../../../shared/actionType";
import useCategories from "../../../shared/hooks/useCategories";
import { SocialConflictFormValues } from "../../../shared/SocialConflictFormValues";
import moment from "moment";
import { motivesEnum, motivesLabelsEnum } from "../../../shared/motives";
import {
  organizationTypeEnum,
  organizationTypeLabelEnum,
} from "../../../shared/organizationType";
import {
  contractTypeEnum,
  contractTypeLabelsEnum,
} from "../../../shared/contractTypeEnum";

interface AdminSocialConflictDetailRouteParams {
  _id?: string;
}

const AdminSocialConflictsDetail: React.FunctionComponent<RouteComponentProps<
  AdminSocialConflictDetailRouteParams
>> = ({ match, history }) => {
  const location = useLocation();
  const [locationStateDefaultValues] = useState(
    get(location, "state.defaultValues", undefined)
  );
  const { categories, isLoadingCategories } = useCategories();

  const isEditing = !!match.params && match.params._id;
  const socialConflictId = isEditing && match.params._id;

  const [form] = Form.useForm();

  const [isSending, setIsSending] = useState(false);
  const saveForm = async (values: any) => {
    setIsSending(true);

    try {
      const formValues: SocialConflictFormValues = values;
      formValues.actions = formValues.actions.filter(
        (d) => d.actionTypeIds && d.actionTypeIds.length
      );

  


      const endpoint = isEditing
        ? ApiEndpoints.SOCIAL_CONFLICTS_EDIT
        : ApiEndpoints.SOCIAL_CONFLICTS_ADD;
      await FetchService.request(endpoint, {
        body: JSON.stringify({
          // socialConflictValues,
          socialConflictId,
        }),
      });
      form.resetFields();
      message.success(
        isEditing ? "Conflicto actualizado" : "Conflicto guardado"
      );

      if (isEditing) {
        history.push(URLS.ADMIN_CONFLICTS);
      }
      if (locationStateDefaultValues) {
        history.push(URLS.ADMIN_CONFLICTS_NEW);
      }
    } catch (e) {
      message.error(JSON.stringify(e));
    } finally {
      setIsSending(false);
    }
  };

  const [socialConflict, setSocialConflict] = useState<SocialConflict>();
  const [isLoadingSocialConflict, setIsLoadingSocialConflict] = useState(true);

  useEffect(() => {
    const fetchSocialConflict = async () => {
      setIsLoadingSocialConflict(true);
      const { socialConflict } = await FetchService.request(
        ApiEndpoints.SOCIAL_CONFLICTS_DETAIL,
        {
          body: JSON.stringify({ socialConflictId }),
        }
      );
      setSocialConflict(socialConflict);
      setIsLoadingSocialConflict(false);
    };

    if (isEditing) {
      fetchSocialConflict();
    }
  }, [isEditing, socialConflictId]);

  const isLoading = isEditing && isLoadingSocialConflict;

  if (isLoading) {
    return <Spin />;
  }

  let initialValues: Partial<SocialConflictFormValues> = {
    actions: [
      {
        date: moment(),
      },
    ],
  };

  if (socialConflict && isEditing) {
    initialValues = {
      ...socialConflict,
      actions: socialConflict.actions.map((action) => ({
        ...action,
        date: moment(action.date),
      })),
    };
  }

  return (
    <Card title={<BackCardTitle title="Agregar conflicto" />}>
      <Row>
        <Col md={{ span: 22 }}>
          <Form
            form={form}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            onFinish={saveForm}
            initialValues={initialValues}
          >
            <Form.Item
              label={
                <>
                  <span style={{ display: "inline-block", marginRight: 5 }}>
                    Empresa/Ente
                  </span>
                  <Tooltip title="En caso de haber multiples conflictos, se podria dar un nombre al conflicto. ej. 'Tren Roca - Maquinistas' y 'Tren Roca - Limpieza'">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </>
              }
              name="title"
              rules={[{ required: true }]}
            >
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              label="Sector"
              name="sectorId"
              rules={[{ required: true }]}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                loading={isLoadingCategories}
              >
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>


            <Row gutter={10}>
              <Col md={4} />
              <Col md={10}>
                <Form.Item
                  label={"Principal demanda"}
                  name="mainDemand"
                  rules={[{ required: true }]}
                >
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    loading={isLoadingCategories}
                  >
                    {Object.keys(motivesEnum).map((motiveCode) => (
                      <Select.Option key={motiveCode} value={motiveCode}>
                        {motivesLabelsEnum[motiveCode]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={10}>
                <Form.Item label="Otras demandas" name="otherDemands">
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    loading={isLoadingCategories}
                    mode="multiple"
                  >
                    {Object.keys(motivesEnum).map((motiveCode) => (
                      <Select.Option key={motiveCode} value={motiveCode}>
                        {motivesLabelsEnum[motiveCode]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={4} />
              <Col md={10}>
                <Form.Item label="Tipo contrato" name="contractType">
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    loading={isLoadingCategories}
                    mode="multiple"
                  >
                    {Object.keys(contractTypeEnum).map((contractTypeCode) => (
                      <Select.Option
                        key={contractTypeCode}
                        value={contractTypeCode}
                      >
                        {contractTypeLabelsEnum[contractTypeCode]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={10}>
                <Form.Item label="Resolucion de conf." name="resolution">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <hr />

            <Form.List name="actions">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <Form.Item
                        label={`Acciones ${index + 1}`}
                        required={false}
                        key={field.key}
                        style={{ marginBottom: 10 }}
                      >
                        <Row gutter={10} style={{ marginBottom: 10 }}>
                          <Col md={6}>
                            <Form.Item
                              {...field}
                              name={[field.name, "date"]}
                              fieldKey={[field.fieldKey, "date"]}
                              validateTrigger={["onChange", "onBlur"]}
                              noStyle
                              rules={[{ required: true }]}
                            >
                              <DatePicker
                                autoFocus
                                format={DATE_FORMAT}
                                placeholder="Fecha"
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                          <Col md={18}>
                            <Form.Item
                              {...field}
                              name={[field.name, "actionTypeIds"]}
                              fieldKey={[field.fieldKey, "actionTypeIds"]}
                              validateTrigger={["onChange", "onBlur"]}
                              noStyle
                              rules={[{ required: true }]}
                            >
                              <Select
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Medidas tomadas"
                                mode="multiple"
                              >
                                {Object.values(actionTypeEnum).map(
                                  (actionTypeCode) => (
                                    <Select.Option
                                      value={actionTypeCode}
                                      key={actionTypeCode}
                                      title={
                                        actionTypeLabelsEnum[actionTypeCode]
                                      }
                                    >
                                      {actionTypeLabelsEnum[actionTypeCode]}
                                    </Select.Option>
                                  )
                                )}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={10}>
                          <Col md={10}>
                            <Form.Item
                              {...field}
                              name={[field.name, "antagonists"]}
                              fieldKey={[field.fieldKey, "antagonists"]}
                              validateTrigger={["onChange", "onBlur"]}
                              noStyle
                            >
                              <Select
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Contra quien"
                                mode="multiple"
                              >
                                {Object.values(antagonistsEnum).map(
                                  (antagonistCode) => (
                                    <Select.Option
                                      value={antagonistCode}
                                      key={antagonistCode}
                                      title={
                                        antagonistsLabelsEnum[antagonistCode]
                                      }
                                    >
                                      {antagonistsLabelsEnum[antagonistCode]}
                                    </Select.Option>
                                  )
                                )}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col md={6}>
                            <Form.Item
                              name={[field.name, "actionDuration"]}
                              fieldKey={[field.fieldKey, "actionDuration"]}
                            >
                              <Input placeholder="Duracion. ej. 48hs" />
                            </Form.Item>
                          </Col>
                          <Col md={6}>
                            <Form.Item
                              name={[field.name, "actionParticipants"]}
                              fieldKey={[field.fieldKey, "actionParticipants"]}
                            >
                              <InputNumber placeholder="Cant. participantes" />
                            </Form.Item>
                          </Col>
                          <Col md={2}>
                            {fields.length > 1 && (
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            )}
                          </Col>
                        </Row>
                        <Row gutter={10} style={{ marginBottom: 10 }}>
                          <Col md={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, "organizationTypes"]}
                              fieldKey={[field.fieldKey, "organizationTypes"]}
                              validateTrigger={["onChange", "onBlur"]}
                              noStyle
                            >
                              <Select
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Tipo de organización convocante"
                                mode="multiple"
                              >
                                {Object.values(organizationTypeEnum).map(
                                  (organizationTypeCode) => (
                                    <Select.Option
                                      value={organizationTypeCode}
                                      key={organizationTypeCode}
                                      title={
                                        organizationTypeLabelEnum[
                                          organizationTypeCode
                                        ]
                                      }
                                    >
                                      {
                                        organizationTypeLabelEnum[
                                          organizationTypeCode
                                        ]
                                      }
                                    </Select.Option>
                                  )
                                )}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col md={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, "organizationName"]}
                              fieldKey={[field.fieldKey, "organizationName"]}
                              validateTrigger={["onChange", "onBlur"]}
                              noStyle
                            >
                              <Input placeholder="Que organizacion?" />
                            </Form.Item>
                          </Col>
                          <Col md={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, "unionRole"]}
                              fieldKey={[field.fieldKey, "unionRole"]}
                              validateTrigger={["onChange", "onBlur"]}
                              noStyle
                            >
                              <Input placeholder="Rol del sindicato" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={10}>
                          <Col md={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, "supportedBy"]}
                              fieldKey={[field.fieldKey, "supportedBy"]}
                              noStyle
                            >
                              <Input placeholder="Sectores en apoyo" />
                            </Form.Item>
                          </Col>
                          <Col md={8}>
                            <Form.Item
                              {...field}
                              label="Choques?"
                              name={[field.name, "clashes"]}
                              fieldKey={[field.fieldKey, "clashes"]}
                              validateTrigger={["onChange", "onBlur"]}
                              valuePropName="checked"
                            >
                              <Checkbox />
                            </Form.Item>
                          </Col>
                          <Col md={8}>
                            <Form.Item
                              {...field}
                              label="Izquierda presente?"
                              name={[field.name, "leftPresent"]}
                              fieldKey={[field.fieldKey, "leftPresent"]}
                              validateTrigger={["onChange", "onBlur"]}
                              valuePropName="checked"
                            >
                              <Checkbox />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={10}>
                          <Col md={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "link1"]}
                              fieldKey={[field.fieldKey, "link1"]}
                              validateTrigger={["onChange", "onBlur"]}
                              noStyle
                            >
                              <Input placeholder="Link 1" />
                            </Form.Item>
                          </Col>
                          <Col md={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, "link2"]}
                              fieldKey={[field.fieldKey, "link2"]}
                              validateTrigger={["onChange", "onBlur"]}
                            >
                              <Input placeholder="Link 2" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    ))}

                    <Form.Item wrapperCol={{ md: { offset: 7 } }}>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                      >
                        <PlusOutlined /> Agregar accion
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>

            <Form.Item label="Observaciones" name="observations">
              <Input.TextArea autoFocus />
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
export default withRouter(AdminSocialConflictsDetail);
