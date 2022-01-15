import { NowRequest, NowResponse } from "@now/node";
import { ObjectId, ObjectID } from "mongodb";
import { allowCors, onlyLoggedIn, checkParams } from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";
import { getHashForPassword } from "../imports/auth";

module.exports = async (req: NowRequest, res: NowResponse) => {
  try {
    allowCors({ res });
    await onlyLoggedIn({ req, res });
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const Users = await db.collection("users");

    // LIST
    if (requestedUrl === "/api/users/list") {
      const users = await Users.find({}).toArray();
      res
        .status(200)
        .json({ users })
        .end();
    }
    // ADD
    else if (requestedUrl === "/api/users/add") {
      const schema = {
        type: "object",
        required: ["userValues"],
        properties: {
          userValues: {
            type: "object",
            required: ["email", "password", "role"],
            properties: {
              email: {
                type: "string"
              },
              password: {
                type: "string"
              },
              role: {
                type: "string"
              }
            }
          }
        }
      };

      const { userValues } = checkParams<any>(req.body, schema, res);
      const { email, password, role } = userValues;

      // Check if we already we have a user with the same email
      if (await Users.findOne({ email })) {
        res
          .status(400)
          .json({
            message: "There's already a user with the same email"
          })
          .end();
        return;
      }

      const { insertedId: newUserId } = await Users.insertOne({
        email,
        role,
        hash: await getHashForPassword(password),
        createdAt: new Date()
      });

      res
        .status(200)
        .json({ newUserId })
        .end();
    }
    // EDIT
    else if (requestedUrl === "/api/users/edit") {
      const schema = {
        type: "object",
        required: ["userValues", "userId"],
        properties: {
          userId: { type: "string" },
          userValues: {
            type: "object",
            required: ["email", "password", "role"],
            properties: {
              email: { type: "string" },
              password: { type: "string" },
              role: { type: "string" }
            }
          }
        }
      };

      const { userValues, userId } = checkParams<any>(req.body, schema, res);
      const { email, password, role } = userValues;

      const { modifiedCount } = await Users.updateOne(
        { _id: new ObjectID(userId) },
        {
          $set: {
            email,
            role,
            hash: await getHashForPassword(password)
          }
        }
      );

      res
        .status(200)
        .json({ modifiedCount })
        .end();
    }
    // DETAIL
    else if (requestedUrl === "/api/users/detail") {
      const schema = {
        type: "object",
        required: ["userId"],
        properties: {
          userId: { type: "string" }
        }
      };

      const { userId } = checkParams<any>(req.body, schema, res);

      const [user] = await Users.find(
        {
          _id: new ObjectId(userId)
        },
        {
          projection: {
            hash: 0
          }
        }
      ).toArray();

      res
        .status(200)
        .json({ user })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
};
