import { io } from "socket.io-client";
import { SOCKET_IO_URL } from "./components/config";

export const socket = io(SOCKET_IO_URL);
