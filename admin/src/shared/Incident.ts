import { MongoId } from "./MongoId";

export type Incident = {
  _id: MongoId;
  createdAt: Date;

  situation: string;
  role: string;
  company: string;
  place: string;
  description: string;
  reportedTo: string;
  images: {
    url: string;
    fileName: string;
  }[];
  status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED";
};

export enum IncidentStatusRealEnum {
  RECEIVED = "RECEIVED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}

export const IncidentStatusEnum: { [x: string]: string } = {
  RECEIVED: "RECEIVED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
};

export const IncidentStatusLabel = {
  [IncidentStatusEnum.RECEIVED]: "Recibido",
  [IncidentStatusEnum.IN_PROGRESS]: "En Progreso",
  [IncidentStatusEnum.RESOLVED]: "Resuelto",
};
