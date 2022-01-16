import { MongoId } from "./MongoId";

export type UsefulInfo = {
  _id: MongoId;
  title: string;
  description: string;
  content: string;
  createdAt: Date;
};
export type UsefulInfoProjection = {
  [P in keyof UsefulInfo]?: 0 | 1;
};
