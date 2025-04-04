import { Request, Response } from "express";
import { contentSchema } from "../utils/zodValidator";
import { AuthRequest } from "../middlewares/authMiddleware";
import Tag from "../model/tag.model";
import Content from "../model/content.model";

export const createContent = async (req: Request, res: Response) => {
  try {
    const parsedData = contentSchema.omit({ userId: true }).safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error.format() });
      return;
    }

    const userId = (req as AuthRequest).user?.id;
    // console.log(userId);
    if (!userId) {
      res.status(401).json({ error: "Unauthorised" });
      return;
    }

    const { link, title, type, tag } = parsedData.data;

    let tagId = [];
    if (tag && tag.length > 0) {
      for (const tagTitle of tag) {
        let tag = await Tag.findOne({ title: tagTitle });
        if (!tag) {
          tag = await new Tag({ title: tagTitle }).save();
        }
        tagId.push(tag._id);
      }
    }

    const newContent = await Content.create({
      link,
      title,
      type,
      tag: tagId,
      userId,
    });

    res.status(201).json({ message: "Content Created", content: newContent });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error: Create-Content handler" });
    return;
  }
};

export const getContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const content = await Content.find({ userId }).populate("tag");
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

export const deleteContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const contentId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const content = await Content.findById(contentId);
    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    if (content.userId.toString() !== userId) {
      res.status(403).json({ error: "FORBIDDEN: Not your Content" });
      return;
    }

    await Content.findByIdAndDelete(contentId);
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server ERROR: content delete handler" });
    return;
  }
};
