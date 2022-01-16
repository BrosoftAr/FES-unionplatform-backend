import { MongoId } from "./MongoId";

export type User = {
  _id: MongoId;
  username: string;
  hash: string;
  role: "ADMIN" | "REPORTER";
};
export type UserProjection = {
  [P in keyof User]?: 0 | 1;
};
