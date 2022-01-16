import Ajv from "ajv";
import { NowResponse } from "@now/node";
import getDatabaseConnection from "./dbConnection";
import { ObjectID } from "mongodb";
import fetch from "node-fetch";

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
    const Users = await db.collection("user");
    const user = Users.findOne({ _id: new ObjectID(validatedToken.userId) });

    if (!user) {
      throw new Error("User does not exist");
    }
  } catch {
    res.status(401).end();
    throw new Error("Token not valid");
  }
};

export const getPlaceInformation = async ({ place_id }) => {
  const googleMapsApiKey = "AIzaSyA6v4nkwb4XOzB2xVKHNdNyoy44c0dGAZg";
  const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=address_components&key=${googleMapsApiKey}`;

  try {
    const response = await fetch(endpoint);
    const json = await response.json();
    const { address_components } = json.result;

    const locality = address_components.find((add) => {
      return add.types.includes("political") && add.types.includes("locality");
    });

    const district = address_components.find((add) => {
      return (
        add.types.includes("political") &&
        add.types.includes("administrative_area_level_2")
      );
    });

    const province = address_components.find((add) => {
      return (
        add.types.includes("political") &&
        add.types.includes("administrative_area_level_1")
      );
    });

    return {
      locality,
      district,
      province,
      address_components,
    };
  } catch (e) {
    console.log(e);

    return {
      locality: undefined,
      district: undefined,
      province: undefined,
      address_components: undefined,
    };
  }
};
