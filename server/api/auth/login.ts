import getDatabaseConnection from "../../imports/dbConnection";
import { NowRequest, NowResponse } from "@now/node";
import { allowCors, checkParams, signWithToken } from "../../imports/helpers";
import { checkPasswordHash } from "../../imports/auth";
import { User } from "../../types/User";

interface MethodParams {
  email: string;
  password: string;
  admin: boolean;
}

const schema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    admin: { type: "boolean" },
  },
};

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const { email, password, admin } = checkParams<MethodParams>(
      req.body,
      schema,
      res
    );

    // Get a database connection, cached or otherwise,
    // using the connection string environment variable as the argument
    const db = await getDatabaseConnection();
    const Users = await db.collection<User>("users");

    const user = await Users.findOne({ email });
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

    if(admin && !["ADMIN", "REPORTER"].includes(user.role)) {
      res
        .status(400)
        .json({ message: "Usuario no tiene permisos para acceder" })
        .end();
      return;
    }

    const token = signWithToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res
      .status(200)
      .json({ token })
      .end();
  } catch (e) {
    console.log(e);
  }
});
