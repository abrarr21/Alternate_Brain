import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { brainShare, getSharedLink } from "../controllers/brain.controller";

const brainRouter = Router();

brainRouter.post("/share", authMiddleware, brainShare);

brainRouter.get("/share/:shareLink", getSharedLink);

export default brainRouter;
