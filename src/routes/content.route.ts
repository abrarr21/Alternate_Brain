import { Router } from "express";
import {
  createContent,
  deleteContent,
  getContent,
} from "../controllers/content.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const contentRouter = Router();

contentRouter.post("/create-content", authMiddleware, createContent);

contentRouter.get("/getContent", authMiddleware, getContent);

contentRouter.delete("/delete/:id", authMiddleware, deleteContent);

export default contentRouter;
