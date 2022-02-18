import { NowRequest, NowResponse } from "@now/node";
import { ObjectId } from "mongodb";
import {
  allowCors,
  onlyLoggedIn,
  checkParams,
  onlyLoggedInAdmin
} from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const NewsDb = await db.collection("news");

    // LIST
    if (requestedUrl === "/api/news/list") {
      const schema = {
        type: "object",
        required: ["limit"],
        properties: {
          limit: { type: "number" }
        }
      };
      const { limit } = checkParams<any>(req.body, schema, res);

      const news = await NewsDb.find({})
        .limit(limit)
        .sort("createdAt", -1)
        .toArray();
      res.status(200).json({ news });
      return;
    }
    // DETAIL
    else if (requestedUrl === "/api/news/detail") {
      const schema = {
        type: "object",
        required: ["newsId"],
        properties: {
          newsId: { type: "string" }
        }
      };

      const { newsId } = checkParams<any>(req.body, schema, res);

      const news = await NewsDb.findOne({
        _id: new ObjectId(newsId)
      });

      res
        .status(200)
        .json({ news })
        .end();
    }

    await onlyLoggedInAdmin({ req, res });

    // ADD
    if (requestedUrl === "/api/news/add") {
      const schema = {
        type: "object",
        required: ["newsValues"],
        properties: {
          newsValues: {
            type: "object",
            required: ["title", "description", "thumbnail", "content"],
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              thumbnail: {
                type: "object",
                required: ["fileName", "fileKey"],
                properties: {
                  fileName: { type: "string" },
                  fileKey: { type: "string" }
                }
              },
              content: { type: "string" }
            }
          }
        }
      };

      const { newsValues: newNews } = checkParams<any>(req.body, schema, res);

      const { insertedId: newNewsId } = await NewsDb.insertOne({
        ...newNews,
        thumbnail: {
          ...newNews.thumbnail,
          url: `https://storage.googleapis.com/${process.env.CLOUD_STORAGE_BUCKET_NAME}/${newNews.thumbnail.fileKey}`
        },
        createdAt: new Date()
      });

      res
        .status(200)
        .json({ newNewsId })
        .end();
    }
    // EDIT
    else if (requestedUrl === "/api/news/edit") {
      const schema = {
        type: "object",
        required: ["newsValues", "newsId"],
        properties: {
          newsId: { type: "string" },
          newsValues: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              thumbnail: {
                type: "object",
                required: ["fileName", "fileKey"],
                properties: {
                  fileName: { type: "string" },
                  fileKey: { type: "string" }
                }
              },
              content: { type: "string" }
            }
          }
        }
      };

      const { newsId, newsValues } = checkParams<any>(req.body, schema, res);

      const { modifiedCount } = await NewsDb.updateOne(
        { _id: new ObjectId(newsId) },
        {
          $set: {
            ...newsValues,
            thumbnail: {
              ...newsValues.thumbnail,
              url: `https://storage.googleapis.com/${process.env.CLOUD_STORAGE_BUCKET_NAME}/${newsValues.thumbnail.fileKey}`
            },
            updatedAt: new Date()
          }
        }
      );

      res
        .status(200)
        .json({ modifiedCount })
        .end();
    }
    // DELETE
    else if (requestedUrl === "/api/news/remove") {
      const schema = {
        type: "object",
        required: ["newsId"],
        properties: {
          newsId: { type: "string" }
        }
      };

      const { newsId } = checkParams<any>(req.body, schema, res);

      const news = await NewsDb.deleteOne({
        _id: new ObjectId(newsId)
      });

      res
        .status(200)
        .json({ news })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
});
