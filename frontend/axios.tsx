import { API_BASE_URL } from "@/app/components/config";
import axios from "axios";

function readCookie(name: string) {
  if (typeof window !== "undefined") {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}

export const BackendClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    AuthorizationSession: readCookie("stytch_session"),
    "Content-Type": "application/json",
  },
  transformRequest: [
    (data) => {
      return JSON.stringify(data);
    },
  ],
});
