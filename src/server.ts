import express from "express";
import dotenv from "dotenv";
import User from "./model/user.model";
import connectDB from "./db/db";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("hello there!!!!");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({ email, password });
  await newUser.save();

  res.json({
    message: "User created!!!",
    userInfo: {
      id: newUser._id,
      email,
      password,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
  connectDB();
});
