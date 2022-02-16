import { NowRequest, NowResponse } from "@now/node";
import { ObjectId } from "mongodb";
import {
  allowCors,
  onlyLoggedIn,
  checkParams,
  onlyLoggedInAdmin
} from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const IncidentsDb = await db.collection("incidents");

    const user = await onlyLoggedIn({ req, res });

    // LIST
    if (requestedUrl === "/api/incidents/list") {
      const schema = {
        type: "object",
        required: ["limit"],
        properties: {
          limit: { type: "number" }
        }
      };
      const { limit } = checkParams<any>(req.body, schema, res);

      const query = user.role === "WORKER" ? { createdBy: user._id } : {};

      const incidents = await IncidentsDb.find(query)
        .limit(limit)
        .sort("createdAt", -1)
        .toArray();
      res.status(200).json({ incidents });
      return;
    }
    // DETAIL
    else if (requestedUrl === "/api/incidents/detail") {
      const schema = {
        type: "object",
        required: ["incidentId"],
        properties: {
          incidentId: { type: "string" }
        }
      };

      const { incidentId } = checkParams<any>(req.body, schema, res);

      const incident = await IncidentsDb.findOne({
        _id: new ObjectId(incidentId)
      });

      res
        .status(200)
        .json({ incident })
        .end();
    }

    await onlyLoggedInAdmin({ req, res });

    // ADD
    if (requestedUrl === "/api/incidents/add") {
      console.log("user", user);
      const schema = {
        type: "object",
        required: ["description", "images", "place", "role", "situation"],
        properties: {
          description: { type: "string" },
          images: {
            type: "array",
            items: {
              type: "object",
              required: ["fileName", "fileKey"],
              properties: {
                fileName: { type: "string" },
                fileKey: { type: "string" }
              }
            }
          },
          place: { type: "string" },
          role: { type: "string" },
          situation: { type: "string" },
          reportedTo: { type: "string" }
        }
      };

      const {
        description,
        images,
        place,
        role,
        situation,
        reportedTo
      } = checkParams<any>(req.body, schema, res);

      const { insertedId: newCategoryId } = await IncidentsDb.insertOne({
        description,
        images: images.map(image => ({
          ...image,
          url: `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${image.fileKey}`
        })),
        place,
        role,
        situation,
        reportedTo,
        createdBy: user._id,
        createdAt: new Date(),
        status: "RECEIVED"
      });

      res
        .status(200)
        .json({ newCategoryId })
        .end();
    }
    // UDPATE STATUS
    else if (requestedUrl === "/api/incidents/updateStatus") {
      const schema = {
        type: "object",
        required: ["incidentId", "newStatus"],
        properties: {
          incidentId: { type: "string" },
          newStatus: { type: "string" }
        }
      };

      const { incidentId, newStatus } = checkParams<any>(req.body, schema, res);

      const { modifiedCount } = await IncidentsDb.updateOne(
        { _id: new ObjectId(incidentId) },
        {
          $set: {
            status: newStatus,
            updatedAt: new Date()
          }
        }
      );

      res
        .status(200)
        .json({ modifiedCount })
        .end();
    } else if (requestedUrl === "/api/incidents/getImageUploadToken") {
      console.log("request received");

      const schema = {
        type: "object",
        required: ["fileName"],
        properties: {
          fileName: { type: "string" }
        }
      };
      const { fileName } = checkParams<any>(req.body, schema, res);

      const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY
        }
      });
      const bucket = storage.bucket(process.env.BUCKET_NAME);
      const file = bucket.file(`${uuidv4()}${fileName}`);
      const options = {
        expires: Date.now() + 5 * 60 * 1000, //  5 minutes,
        fields: { "x-goog-meta-test": "data" }
      };
      const [response] = await file.generateSignedPostPolicyV4(options);
      res.status(200).json(response);
    }
  } catch (e) {
    console.log(e);
  }
});
