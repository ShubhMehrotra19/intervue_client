import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () =>
      console.log("Connected to server:", this.socket.id)
    );

    this.socket.on("disconnect", (reason) =>
      console.log("Disconnected:", reason)
    );

    this.socket.on("connect_error", (error) =>
      console.error("Connection error:", error)
    );

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (!this.socket) return console.error("Socket not connected");
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) return console.error("Socket not connected");
    this.socket.on(event, callback);

    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);

    if (this.listeners.has(event)) {
      const arr = this.listeners.get(event);
      this.listeners.set(
        event,
        arr.filter((cb) => cb !== callback)
      );
    }
  }

  removeAllListeners(event) {
    if (!this.socket) return;
    this.socket.removeAllListeners(event);
    this.listeners.delete(event);
  }

  getSocketId() {
    return this.socket?.id;
  }

  isConnected() {
    return !!this.socket?.connected;
  }
}

export default new SocketService();
