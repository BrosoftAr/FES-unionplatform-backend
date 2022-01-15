import { MongoId } from "./MongoId";

export type User = {
  _id: MongoId;
  email: string;
  hash: string;
  role: "WORKER" | "ADMIN" | "REPORTER";
  workerProfile: {
    affiliateNumber: string;
    city: string;
    name: string;
    lastName: string;
    phone: string;
  }
};
export type UserProjection = {
  [P in keyof User]?: 0 | 1;
};
