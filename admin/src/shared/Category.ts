import { MongoId } from "./MongoId";

export type Category = {
  _id: MongoId;
  title: string;
  createdAt: Date;
};
export type CategoryProjection = {
  [P in keyof Category]?: 0 | 1;
};
