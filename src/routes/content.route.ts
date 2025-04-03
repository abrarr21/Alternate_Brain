import { Router } from "express";
import { createContent, getContent } from "../controllers/content.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const contentRouter = Router();

contentRouter.post("/create-content", authMiddleware, createContent);

contentRouter.get("/getContent", authMiddleware, getContent);

export default contentRouter;
