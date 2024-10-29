import "dotenv/config";

import { logger } from "./middlewares/logEvents.js";
import errorHandler from "./middlewares/errorHandler.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/mongo/db.js";

const PORT = process.env.PORT || 3100;


import verifyJWT from "./middlewares/verifyJWT.js";

//Routes import
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";

const app = express();

// Open connection with mongo
connectDB();

app.use(logger);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/ping", async (req, res) => {
  res.json({ data: null, message: "pong" })
});

// Public routes
app.use("/api/v1/auth", authRoutes)


// Protected routes
app.use(verifyJWT);
app.use("/api/v1/users", usersRoutes);



app.all('*', (req, res) => {
  return res.json({ "error": "404 Not Found" });
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.info('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});