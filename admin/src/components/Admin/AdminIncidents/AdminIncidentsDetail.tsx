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
} from "antd";
import { RouteComponentProps, withRouter } from "react-router-dom";
import BackCardTitle from "../../BackCardTitle";
import FetchService from "../../../shared/fetchService";
import ApiEndpoints from "../../../shared/ApiEndpoints";
import {
  Incident,
  IncidentStatusEnum,
  IncidentStatusLabel,
} from "../../../shared/Incident";

interface IncidentFormValues {
  situation: string;
  role: string;
  company: string;
  place: string;
  description: string;
  reportedTo: string;
  image: string;
  status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED";
}

interface AdminIncidentsDetailRouteParams {
  _id?: string;
}

const AdminIncidentsDetail: React.FunctionComponent<RouteComponentProps<
  AdminIncidentsDetailRouteParams
>> = ({ match, history }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const incidentId = match.params._id;

  const [form] = Form.useForm();

  const [incident, setIncident] = useState<Incident>();
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoadingIncidents(true);
      const { incident } = await FetchService.request(
        ApiEndpoints.INCIDENTS_DETAIL,
        {
          body: JSON.stringify({ incidentId }),
        }
      );
      setIncident(incident);
      setIsLoadingIncidents(false);
    };

    fetchIncidents();
  }, [incidentId]);

  if (isLoadingIncidents) {
    return <Spin />;
  }

  const updateStatus = async (newStatus: string) => {
    const closeLoading = message.loading("Actualizando estado...", 0);

    try {
      setIsUpdating(true);
      await FetchService.request(ApiEndpoints.INCIDENTS_UPDATE_STATUS, {
        body: JSON.stringify({ incidentId, newStatus }),
      });
      setIsUpdating(false);
      closeLoading();
      message.success("Estado actualizado");
      if (incident) {
        incident.status = newStatus as "RECEIVED" | "IN_PROGRESS" | "RESOLVED";
      }
    } catch (e) {
    } finally {
      closeLoading();
      setIsUpdating(false);
    }
  };

  return (
    <Card title={<BackCardTitle title="Agregar noticia" />}>
      <Row>
        <Col span={16} offset={4}>
          <p>Situación: {incident?.situation}</p>
          <p>Rol: {incident?.role}</p>
          <p>Compañia: {incident?.company}</p>
          <p>Lugar: {incident?.place}</p>
          <p>Descripción: {incident?.description}</p>
          <p>Reportado a: {incident?.reportedTo}</p>
          <p>Situación: {incident?.situation}</p>
          {incident?.images && (
            <p>
              Archivos adjuntos:
              <br />
              {incident.images.map(({ fileName, url }) => (
                <>
                  <a href={url} target="_blank" rel="noreferrer" key={fileName}>
                    {fileName}
                  </a>
                  <br />
                </>
              ))}
            </p>
          )}

          <Form.Item label="Estado" name="status" rules={[{ required: true }]}>
            <Select
              autoFocus
              defaultValue={incident?.status}
              onChange={updateStatus}
              disabled={isUpdating}
            >
              {Object.values(IncidentStatusEnum).map((status) => (
                <Select.Option key={status} value={status}>
                  {IncidentStatusLabel[status]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
export default withRouter(AdminIncidentsDetail);
