import { message } from "antd";
import { API_URL } from "./config";

class FetchService {
  static async request(
    endpoint: string,
    params: RequestInit = {}
  ): Promise<any> {
    const token = localStorage.getItem("token");
    console.log(`${API_URL}${endpoint}`)
    return new Promise((resolve, reject) => {
      fetch(`${API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          authorization: token || "",
        },
        method: "POST",
        ...params,
      })
        .then((res) => {
          if (res.status === 200 && res.ok) {
            res.json().then((json) => {
              resolve(json);
            });
          } else if (res.status === 401) {
            message.error("Necesitas loguearte para realizar esta acción");
            localStorage.removeItem("token");

            res.json().then((json) => {
              reject(json);
            });
          } else {
            res.json().then((json) => {
              reject(json);
            });
          }
        })
        .catch(() => {
          reject({ message: "Request failed" });
        });
    });
  }
}
export default FetchService;
