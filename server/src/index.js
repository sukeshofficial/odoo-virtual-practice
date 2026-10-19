import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/v1/health`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed successfully");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed successfully");
    process.exit(0);
  });
});