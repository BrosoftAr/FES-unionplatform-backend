import { MongoId } from "./MongoId";

export type News = {
  _id: MongoId;
  title: string;
  description: string;
  content: string;
  thumbnail: {
    fileName: string;
    fileKey: string;    
    url: string;
  };
  createdAt: Date;
};
export type NewsProjection = {
  [P in keyof News]?: 0 | 1;
};
