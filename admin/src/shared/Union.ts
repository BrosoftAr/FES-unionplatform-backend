import { MongoId } from "./MongoId";

export type Union = {
  _id: MongoId;
  title: string;
  createdAt: Date;
};
export type UnionProjection = {
  [P in keyof Union]?: 0 | 1;
};
