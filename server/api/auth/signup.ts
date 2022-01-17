import getDatabaseConnection from "../../imports/dbConnection";
import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  allowCors,
  checkParams,
  createVerificationToken,
  getHtmlTemplate,
  replaceAll,
  signWithToken
} from "../../imports/helpers";
import { getHashForPassword } from "../../imports/auth";
import { User } from "../../types/User";
import EmailService from "../../imports/EmailService";

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
    affiliateNumber: { type: "string" },
    city: { type: "string" },
    email: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
    password: { type: "string" },
    phone: { type: "string" }
  }
};

module.exports = allowCors(async (req: VercelRequest, res: VercelResponse) => {
  try {
    const {
      email,
      password,
      name,
      lastName,
      phone,
      city,
      affiliateNumber
    } = checkParams<MethodParams>(req.body, schema, res);

    console.log("here");

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

    const newUser: User = {
      email,
      hash: await getHashForPassword(password),
      role: "WORKER",
      isActive: true,
      workerProfile: {
        affiliateNumber,
        city,
        phone,
        name,
        lastName
      },
      createdAt: new Date(),
      isVerified: false,
      verificationToken: createVerificationToken()
    };

    const { insertedId: newUserId } = await Users.insertOne(newUser);

    const activationLink = `${process.env.FRONTEND_CLIENT_URL}auth/verify/${newUser.verificationToken.token}`;

    let html = getHtmlTemplate("signup-email-template");
    html = replaceAll(replaceAll(html, "{USERNAME}", `${name} ${lastName}`), "{ACTIVATIONLINK}", activationLink)

    await EmailService.sendEmail({
      to: email,
      subject: "Activar cuenta de Union Platform",
      text: "Por favor active su cuenta",
      html
    });

    res
      .status(200)
      .json({ newUserId })
      .end();
  } catch (e) {
    console.log(e);
  }
});
