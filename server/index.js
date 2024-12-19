import mongoose from "mongoose";
import app from "./app.js";

// UNHANDLED EXCEPTION
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION 💥💥", err);
  console.log("Shutting down the server...");
  process.exit(1);
});

// Database connection
mongoose.connect(process.env.DATABASE_CONNECTION_LOCAL).then(() => {
  console.log("Successfully connected to the database.");
});

// Server
const server = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Application is listening on port ${process.env.PORT}...`);
});

// UNHANDLED REJECTION
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 💥💥", err);
  console.log("Shutting down the server...");
  server.close(() => {
    process.exit(1);
  });
});
