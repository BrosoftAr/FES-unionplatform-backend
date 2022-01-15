import { NowRequest, NowResponse } from "@now/node";
import { ObjectId } from "mongodb";
import { allowCors, onlyLoggedIn, checkParams } from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";

module.exports = async (req: NowRequest, res: NowResponse) => {
  try {
    allowCors({ res });
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const Unions = await db.collection("unions");

    // LIST
    if (requestedUrl === "/api/unions/list") {
      const unions = await Unions.find({}).toArray();
      res.status(200).json({ unions });
      return;
    }

    await onlyLoggedIn({ req, res });

    // ADD
    if (requestedUrl === "/api/unions/add") {
      const schema = {
        type: "object",
        required: ["unionValues"],
        properties: {
          unionValues: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string" },
            },
          },
        },
      };

      const { unionValues: newUnion } = checkParams<any>(req.body, schema, res);

      const { insertedId: newUnionId } = await Unions.insertOne({
        ...newUnion,
        createdAt: new Date(),
      });

      res
        .status(200)
        .json({ newUnionId })
        .end();
    }
    // EDIT
    else if (requestedUrl === "/api/unions/edit") {
      const schema = {
        type: "object",
        required: ["unionValues", "unionId"],
        properties: {
          unionId: { type: "string" },
          unionValues: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string" },
            },
          },
        },
      };

      const { unionId, unionValues } = checkParams<any>(req.body, schema, res);

      const { modifiedCount } = await Unions.updateOne(
        { _id: new ObjectId(unionId) },
        {
          $set: {
            ...unionValues,
            updatedAt: new Date(),
          },
        }
      );

      res
        .status(200)
        .json({ modifiedCount })
        .end();
    }
    // DETAIL
    else if (requestedUrl === "/api/unions/detail") {
      const schema = {
        type: "object",
        required: ["unionId"],
        properties: {
          unionId: { type: "string" },
        },
      };

      const { unionId } = checkParams<any>(req.body, schema, res);

      const union = await Unions.findOne({
        _id: new ObjectId(unionId),
      });

      res
        .status(200)
        .json({ union })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
};
