import getDatabaseConnection from "../../imports/dbConnection";
import { NowRequest, NowResponse } from "@now/node";

import {
  allowCors,
  checkParams,
  getHtmlTemplate,
  replaceAll,
  signWithToken
} from "../../imports/helpers";
import { checkPasswordHash, getHashForPassword } from "../../imports/auth";
import { User } from "../../types/User";
import moment from "moment";
import EmailService from "../../imports/EmailService";

interface MethodParams {
  email: string;
  password: string;
  admin: boolean;
}

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl =/*  */ req.url;
    // Get a database connection, cached or otherwise,
    // using the connection string environment variable as the argument
    const db = await getDatabaseConnection();
    const Users = await db.collection<User>("users");

    // LOGIN
    if (requestedUrl === "/api/auth/login") {
      const schema = {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
          admin: { type: "boolean" }
        }
      };

      const { email, password, admin } = checkParams<MethodParams>(
        req.body,
        schema,
        res
      );

      const user = await Users.findOne({ email });
      console.log(Users);
      if (!user) {
        res
          .status(400)
          .json({ message: "Usuario/contraseña incorrecta" })
          .end();
        return;
      }

      const validPassword = await checkPasswordHash(password, user.hash);
      if (!validPassword) {
        res
          .status(400)
          .json({ message: "Usuario/contraseña incorrecta" })
          .end();
        return;
      }

      if (admin && !["ADMIN", "REPORTER"].includes(user.role)) {
        res
          .status(400)
          .json({ message: "Usuario no tiene permisos para acceder" })
          .end();
        return;
      }

      if (!user.isVerified) {
        const activationLink = `${process.env.FRONTEND_CLIENT_URL}auth/verify/${user.verificationToken.token}`;

        let html = getHtmlTemplate("signup-email-template");
        html = replaceAll(
          replaceAll(html, "{USERNAME}", `${user.workerProfile.name} ${user.workerProfile.lastName}`),
          "{ACTIVATIONLINK}",
          activationLink
        );

        await EmailService.sendEmail({
          to: email,
          subject: "Activar cuenta de Union Platform",
          text: "Por favor active su cuenta",
          html
        });

        res
          .status(400)
          .json({
            message:
              "El usuario no esta activo. Verifique su email y active su cuenta."
          })
          .end();
        return;
      }

      const token = signWithToken({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      res
        .status(200)
        .json({ token })
        .end();
    }
    // ACTIVATION
    else if (requestedUrl === "/api/auth/activation") {
      const schema = {
        type: "object",
        required: ["activationToken"],
        properties: {
          activationToken: { type: "string" }
        }
      };

      const { activationToken } = checkParams<{ activationToken: string }>(
        req.body,
        schema,
        res
      );

      console.log("activationToken", activationToken);

      const user = await Users.findOne({
        "verificationToken.token": activationToken
      });

      if (!user) {
        res
          .status(400)
          .json({
            message:
              "El link de activación no es válido. Intente nuevamente utilizando la opción 'Olvidé mi contraseña'."
          })
          .end();
        return;
      }

      if (user.isVerified) { 
        res
          .status(400)
          .json({
            message:
              "El usuario ya está activado. Puede ingresar usando el login."
          })
          .end();
        return;
      }

      if (moment(user.verificationToken.expiresAt).isBefore()) {
        res
          .status(400)
          .json({
            message:
              "El link de activación expiró. Intente nuevamente utilizando la opción 'Olvidé mi contraseña'."
          })
          .end();
        return;
      }

      const token = signWithToken({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      await Users.updateOne(
        { _id: user._id },
        {
          $set: {
            isVerified: true,
            verificationToken: null
          }
        }
      );

      res
        .status(200)
        .json({ token })
        .end();
    }// RESET
    else if (requestedUrl === "/api/auth/resetPassword") {
      const schema = {
        type: "object",
        required: ["activationToken", "password"],
        properties: {
          activationToken: { type: "string" },
          password: { type: "string" }
        }
      };

      const { activationToken, password } = checkParams<{ activationToken: string, password: string }>(
        req.body,
        schema,
        res
      );

      const user = await Users.findOne({
        "verificationToken.token": activationToken
      });

      if (!user) {
        res
          .status(400)
          .json({
            message:
              "El link de activación no es válido. Intente nuevamente utilizando la opción 'Olvidé mi contraseña'."
          })
          .end();
        return;
      }

      if (moment(user.verificationToken.expiresAt).isBefore()) {
        res
          .status(400)
          .json({
            message:
              "El link de activación expiró. Intente nuevamente utilizando la opción 'Olvidé mi contraseña'."
          })
          .end();
        return;
      }

      const token = signWithToken({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      await Users.updateOne(
        { _id: user._id },
        {
          $set: {
            hash: await getHashForPassword(password),
            verificationToken: null,
            isVerified: true
          }
        }
      );

      res
        .status(200)
        .json({ token })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
});
