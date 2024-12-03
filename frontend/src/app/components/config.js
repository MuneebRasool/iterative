const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/"
    : "https://api.goiterative.com/api/";
const SOCKET_IO_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://api.goiterative.com";

const CONVERTER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://converter.goiterative.com";

export { API_BASE_URL, SOCKET_IO_URL, CONVERTER_URL };
