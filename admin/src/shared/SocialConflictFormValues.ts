import { Moment } from "moment";

export interface SocialConflictFormValues {
  title: string;
  sectorId: string;
  location: {
    description: string;
    place_id: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
  mainDemand: string;
  otherDemands: string[];
  resolution: string;
  contractType: string[];

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
}
