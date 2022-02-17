import { NowRequest, NowResponse } from "@now/node";
import { ObjectId, ObjectID } from "mongodb";
import {
  allowCors,
  checkParams,
  createVerificationToken,
  getHtmlTemplate,
  onlyLoggedIn,
  onlyLoggedInAdmin,
  replaceAll
} from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";
import { getHashForPassword } from "../imports/auth";
import EmailService from "../imports/EmailService";

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const Users = await db.collection("users");

    if (requestedUrl === "/api/users/forgotPassword") {
      const schema = {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string" }
        }
      };

      const { email } = checkParams<any>(req.body, schema, res);

      const verificationToken = createVerificationToken();

      const user = await Users.findOne({ email });

      if (user) {
        Users.updateOne({ email }, { $set: { verificationToken } });

        const activationLink = `${process.env.FRONTEND_CLIENT_URL}auth/reset/${verificationToken.token}`;

        let html = getHtmlTemplate("reset-email-template");
        html = replaceAll(
          replaceAll(html, "{USERNAME}", `${user.workerProfile.name} ${user.workerProfile.lastName}`),
          "{ACTIVATIONLINK}",
          activationLink
        );

        await EmailService.sendEmail({
          to: email,
          subject: "Olvide mi contraseña de Union Platform",
          text: "Olvide mi contraseña de Union Platform",
          html
        });
      }

      res
        .status(200)
        .json({})
        .end();
    }

    const user = await onlyLoggedIn({ req, res });

    // MY DETAILS
    if (requestedUrl === "/api/users/myDetails") {
      const myUser = await Users.findOne(
        { _id: user._id },
        { projection: { hash: 0 } }
      );
      res
        .status(200)
        .json({ myUser })
        .end();
    } else if (requestedUrl === "/api/users/updateProfile") {
      const schema = {
        type: "object",
        required: ["phone", "city", "affiliateNumber"],
        properties: {
          phone: {
            type: "string"
          },
          city: {
            type: "string"
          },
          affiliateNumber: {
            type: "string"
          }
        }
      };

      const { phone, city, affiliateNumber } = checkParams<any>(
        req.body,
        schema,
        res
      );

      await Users.updateOne(
        { _id: user._id },
        {
          $set: {
            "workerProfile.phone": phone,
            "workerProfile.city": city,
            "workerProfile.affiliateNumber": affiliateNumber
          }
        }
      );

      res
        .status(200)
        .json({})
        .end();
    } 

    await onlyLoggedInAdmin({ req, res });
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
});
