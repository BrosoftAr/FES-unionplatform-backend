import { NowRequest, NowResponse } from "@now/node";
import { ObjectId } from "mongodb";
import { allowCors, onlyLoggedIn, checkParams, onlyLoggedInAdmin } from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const UsefulInfoDb = await db.collection("useful-info");

    // LIST
    if (requestedUrl === "/api/useful-info/list") {
      const schema = {
        type: "object",
        required: ["limit"],
        properties: {
          limit: { type: "number" }
        }
      };
      const { limit } = checkParams<any>(req.body, schema, res);

      const usefulInfo = await UsefulInfoDb.find({}).limit(limit).sort("createdAt", -1).toArray();

      res.status(200).json({ usefulInfo });
      return;
    }
    // DETAIL
    else if (requestedUrl === "/api/useful-info/detail") {
      const schema = {
        type: "object",
        required: ["usefulInfoId"],
        properties: {
          usefulInfoId: { type: "string" }
        }
      };

      const { usefulInfoId } = checkParams<any>(req.body, schema, res);

      const usefulInfo = await UsefulInfoDb.findOne({
        _id: new ObjectId(usefulInfoId)
      });

      res
        .status(200)
        .json({ usefulInfo })
        .end();
    }

    await onlyLoggedInAdmin({ req, res });

    // ADD
    if (requestedUrl === "/api/useful-info/add") {
      const schema = {
        type: "object",
        required: ["usefulInfoValues"],
        properties: {
          usefulInfoValues: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              content: { type: "string" }
            }
          }
        }
      };

      const { usefulInfoValues: newUsefulInfo } = checkParams<any>(req.body, schema, res);

      const { insertedId: newUsefulInfoId } = await UsefulInfoDb.insertOne({
        ...newUsefulInfo,
        createdAt: new Date()
      });

      res
        .status(200)
        .json({ newUsefulInfoId })
        .end();
    }
    // EDIT
    else if (requestedUrl === "/api/useful-info/edit") {
      const schema = {
        type: "object",
        required: ["usefulInfoValues", "usefulInfoId"],
        properties: {
          usefulInfoId: { type: "string" },
          usefulInfoValues: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              content: { type: "string" }
            }
          }
        }
      };

      const { usefulInfoId, usefulInfoValues } = checkParams<any>(req.body, schema, res);

      const { modifiedCount } = await UsefulInfoDb.updateOne(
        { _id: new ObjectId(usefulInfoId) },
        {
          $set: {
            ...usefulInfoValues,
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
    else if (requestedUrl === "/api/useful-info/remove") {
      const schema = {
        type: "object",
        required: ["usefulInfoId"],
        properties: {
          usefulInfoId: { type: "string" }
        }
      };

      const { usefulInfoId } = checkParams<any>(req.body, schema, res);

      const usefulInfo = await UsefulInfoDb.deleteOne({
        _id: new ObjectId(usefulInfoId)
      });

      res
        .status(200)
        .json({ usefulInfo })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
});
