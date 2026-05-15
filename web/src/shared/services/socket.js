import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:8080", {
      autoConnect: false,
      withCredentials: true,
    });
  }

  return socket;
}
