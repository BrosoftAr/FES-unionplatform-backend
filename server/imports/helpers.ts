import Ajv from "ajv";
import { NowResponse } from "@now/node";
import getDatabaseConnection from "./dbConnection";
import { ObjectID } from "mongodb";

const ajv = new Ajv({ allErrors: true, removeAdditional: "all" });

const jwt = require("jsonwebtoken");

const secret = process.env.AUTH_JWT_SECRET;

export const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

export function checkParams<T>(obj: T, schema, res: NowResponse) {
  const validate = ajv.compile(schema);

  const valid = validate(obj);
  if (!valid) {
    res.status(400).end();
    throw new Error("Invalid params");
  }
  return obj;
}

export const signWithToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export const onlyLoggedIn = async ({ req, res }) => {
  const { authorization: token } = req.headers;
  if (!token) {
    res.status(401).end();
    throw new Error("Authorization header not present");
  }

  try {
    const validatedToken = jwt.verify(token, secret);
    const db = await getDatabaseConnection();
    const Users = await db.collection("users");
    const user = await Users.findOne({ _id: new ObjectID(validatedToken.userId) });

    if (!user) {
      throw new Error("User does not exist");
    }

    return user;
  } catch {
    res.status(401).end();
    throw new Error("Token not valid");
  }
};


export const onlyLoggedInAdmin = async ({ req, res }) => {
  const { authorization: token } = req.headers;
  if (!token) {
    res.status(401).end();
    throw new Error("Authorization header not present");
  }

  try {
    const validatedToken = jwt.verify(token, secret);
    const db = await getDatabaseConnection();
    const Users = await db.collection("users");
    const user = await Users.findOne({ _id: new ObjectID(validatedToken.userId), role: {$in: ["ADMIN", "REPORTER"]} });

    if (!user) {
      throw new Error("User does not exist");
    }

    return user;
  } catch {
    res.status(401).end();
    throw new Error("Token not valid");
  }
};
