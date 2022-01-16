import { NowRequest, NowResponse } from "@now/node";
import { ObjectId } from "mongodb";
import { allowCors, onlyLoggedIn, checkParams } from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const Categories = await db.collection("categories");

    // LIST
    if (requestedUrl === "/api/categories/list") {
      const categories = await Categories.find({}).toArray();
      res.status(200).json({ categories });
      return;
    }

    await onlyLoggedIn({ req, res });

    // ADD
    if (requestedUrl === "/api/categories/add") {
      const schema = {
        type: "object",
        required: ["categoryValues"],
        properties: {
          categoryValues: {
            type: "object",
            required: ["title"],
            properties: {
              title: { type: "string" }
            }
          }
        }
      };

      const { categoryValues: newCategory } = checkParams<any>(
        req.body,
        schema,
        res
      );

      const { insertedId: newCategoryId } = await Categories.insertOne({
        ...newCategory,
        createdAt: new Date()
      });

      res
        .status(200)
        .json({ newCategoryId })
        .end();
    }
    // EDIT
    else if (requestedUrl === "/api/categories/edit") {
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

      const { modifiedCount } = await Categories.updateOne(
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
    else if (requestedUrl === "/api/categories/detail") {
      const schema = {
        type: "object",
        required: ["categoryId"],
        properties: {
          categoryId: { type: "string" }
        }
      };

      const { categoryId } = checkParams<any>(req.body, schema, res);

      const category = await Categories.findOne({
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
