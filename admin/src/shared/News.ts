import { MongoId } from "./MongoId";

export type News = {
  _id: MongoId;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  createdAt: Date;
};
export type NewsProjection = {
  [P in keyof News]?: 0 | 1;
};
