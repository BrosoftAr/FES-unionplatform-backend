import { NowRequest, NowResponse } from "@now/node";
import { ObjectId } from "mongodb";
import { allowCors, onlyLoggedIn, checkParams } from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const IncidentsDb = await db.collection("incidents");

    const user = await onlyLoggedIn({ req, res });
    
    // LIST
    if (requestedUrl === "/api/incidents/list") {
      const incidents = await IncidentsDb.find({createdBy: user._id}).toArray();
      res.status(200).json({ incidents });
      return;
    }


    // ADD
    if (requestedUrl === "/api/incidents/add") {

      console.log('user', user)
      const schema = {
        type: "object",
        required: ["description", "image", "place", "role", "situation"],
        properties: {
          description: { type: "string" },
          image: { type: "string" },
          place: { type: "string" },
          role: { type: "string" },
          situation: { type: "string" },
        }
      };

      const { description, image, place, role, situation } = checkParams<any>(
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
        createdBy: user._id,
        createdAt: new Date()
      });

      res
        .status(200)
        .json({ newCategoryId })
        .end();
    }
    // EDIT
    else if (requestedUrl === "/api/incidents/edit") {
      const schema = {
        type: "object",
        required: ["categoryValues", "categoryId"],
        properties: {
          categoryId: { type: "string" },
          categoryValues: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string" }
            }
          }
        }
      };

      const { categoryId, categoryValues } = checkParams<any>(
        req.body,
        schema,
        res
      );

      const { modifiedCount } = await IncidentsDb.updateOne(
        { _id: new ObjectId(categoryId) },
        {
          $set: {
            ...categoryValues,
            updatedAt: new Date()
          }
        }
      );

      res
        .status(200)
        .json({ modifiedCount })
        .end();
    }
    // DETAIL
    else if (requestedUrl === "/api/incidents/detail") {
      const schema = {
        type: "object",
        required: ["categoryId"],
        properties: {
          categoryId: { type: "string" }
        }
      };

      const { categoryId } = checkParams<any>(req.body, schema, res);

      const category = await IncidentsDb.findOne({
        _id: new ObjectId(categoryId)
      });

      res
        .status(200)
        .json({ category })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
});
