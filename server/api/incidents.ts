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

      const incidents = await IncidentsDb.find(query).limit(limit).sort("createdAt", -1).toArray();
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
        required: ["description", "image", "place", "role", "situation"],
        properties: {
          description: { type: "string" },
          image: { type: "string" },
          place: { type: "string" },
          role: { type: "string" },
          situation: { type: "string" },
          reportedTo: { type: "string" }
        }
      };

      const { description, image, place, role, situation, reportedTo } = checkParams<any>(
        req.body,
        schema,
        res
      );

      const { insertedId: newCategoryId } = await IncidentsDb.insertOne({
        description,
        image,
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
          newStatus: { type: "string" },
        }
      };

      const { incidentId, newStatus } = checkParams<any>(
        req.body,
        schema,
        res
      );

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
    }
  } catch (e) {
    console.log(e);
  }
});
