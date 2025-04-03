import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../utils/zodValidator";
import User from "../model/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(401).json({ error: parsedData.error.format() });
      return;
    }

    const { fullname, email, password } = parsedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exist" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.cookie("token", `Bearer ${token}`);
    res.status(201).json({
      message: "User created successfully",
      token: token,
      id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: signup handler" });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = loginSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error.format() });
      return;
    }

    const { email, password } = parsedData.data;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.cookie("token", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
    res.json({
      message: "Login successfully",
      id: user._id,
      email: user.email,
      token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: Login handler" });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.json({
    message: "Logout successfully",
  });
};
