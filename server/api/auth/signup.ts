import getDatabaseConnection from "../../imports/dbConnection";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors, checkParams, signWithToken } from "../../imports/helpers";
import { getHashForPassword } from "../../imports/auth";

interface MethodParams {
  affiliateNumber: string;
  city: string;
  email: string;
  lastName: string;
  name: string;
  password: string;
  phone: string;
} 

const schema = {
  type: "object",
  required: ["email", "password", "city", "name", "lastName", "phone"],
  properties: {
    affiliateNumber: {type: "string"},
    city: {type: "string"},
    email: {type: "string"},
    lastName: {type: "string"},
    name: {type: "string"},
    password: {type: "string"},
    phone: {type: "string"}
  },
};

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  try { 
    allowCors({ res });


    const { email, password, name,lastName,phone,city,affiliateNumber } = checkParams<MethodParams>(
      req.body,
      schema,
      res
    );

    const db = await getDatabaseConnection();
    const Users = await db.collection("users");


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
        role: "WORKER",
        hash: await getHashForPassword(password),
        createdAt: new Date()
      });

      res
        .status(200)
        .json({ newUserId })
        .end();

    
  } catch (e) {
    console.log(e);
  }
};
