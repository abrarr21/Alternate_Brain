import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db";
import router from "./routes/user.route";
import { authMiddleware } from "./middlewares/authMiddleware";
import cookieParser from "cookie-parser";
import contentRouter from "./routes/content.route";
import brainRouter from "./routes/brain.route";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);
app.use("/api/v1", contentRouter);
app.use("/api/v1/brain", brainRouter);

app.get("/", authMiddleware, (_req, res) => {
  res.send("hello there!!!!");
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
  connectDB();
});
