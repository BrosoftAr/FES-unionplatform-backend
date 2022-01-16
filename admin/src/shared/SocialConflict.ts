import { Moment } from "moment";
import { MongoId } from "./MongoId";

export type SocialConflict = {
  _id: MongoId;
  title: string;
  sectorId: string;
  location: {
    description: string;
    place_id: string;
    coords: {
      lat: number;
      lng: number;
    };
    province?: {
      long_name: string;
    };
    district?: {
      long_name: string;
    };
  };
  mainDemand: string;
  otherDemands: string[];
  resolution: string;
  contractType?: string[];

  actions: {
    date?: Moment;
    actionTypeIds?: string[];
    antagonists?: string[];
    actionDuration?: string;
    actionParticipants?: number;
    organizationTypes?: string[];
    organizationName?: string;
    unionRole?: string;
    supportedBy?: string;
    clashes?: boolean;
    leftPresent?: boolean;
    link1?: string;
    link2?: string;
  }[];
  observations: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type SocialConflictProjection = {
  [P in keyof SocialConflict]?: 0 | 1;
};
