import jwt from "jsonwebtoken";
import { User } from "./User";

class AuthService {
  static saveAuthToken(token: string) {
    localStorage.setItem("token", token);
  }

  static getCurrentRole() {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const payload = jwt.decode(token);
    if (!payload) {
      return null;
    }
    const user = payload as User;

    return user.role;
  }
}
export default AuthService;
