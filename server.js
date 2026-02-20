import "dotenv/config";
import express from "express";

import cors from "cors";
import sequelize from "./src/config/db.js";
import routes from "./src/routes/index.js";


const app = express();

// Permanent CORS fix for local development
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl) or local dev ports
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running on http://localhost:4000");
});

app.use("/api", routes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // Attempt sync but don't crash if it fails (fixes ER_TOO_MANY_KEYS issue)
    try {
      // await sequelize.sync();
      // console.log("Database synced");
    } catch (syncError) {
      console.error("Database sync warning (Server still running):", syncError.message);
    }

    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
