import { Request, Response } from "express";
import Link from "../model/link.model";
import { AuthRequest } from "../middlewares/authMiddleware";
import { randomLink } from "../utils/randomLink";
import Content from "../model/content.model";
import User from "../model/user.model";

export const brainShare = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { share } = req.body;
    const userId = (req as AuthRequest).user?.id;
    // console.log(share);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (share) {
      const existingLink = await Link.findOne({ userId });
      if (existingLink) {
        res.json({
          message: "Link already exist",
          link: existingLink.hash,
        });
        return;
      }

      const hashedLink = randomLink(10);
      await Link.findOneAndUpdate(
        {
          hash: hashedLink,
        },
        { userId },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      res.json({
        message: "Updated Shareable Link",
        link: hashedLink,
      });
    } else {
      await Link.deleteOne({
        userId,
      });
      res.json({ message: "Removed shareable link" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error: brainShare handler" });
    return;
  }
};

export const getSharedLink = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { shareLink } = req.params;
    // console.log(shareLink);

    const link = await Link.findOne({
      hash: shareLink,
    });

    if (!link) {
      res.status(411).json({ error: "Invalid Link!!" });
      return;
    }
    // console.log(link);

    const content = await Content.find({
      userId: link.userId,
    });

    if (!content) {
      res.status(404).json({ error: "Content not found" });
    }
    // console.log(content);

    const user = await User.findById(link.userId);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    // console.log(user);

    res.json({
      username: user.email,
      fullname: user.fullname,
      content: content,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: getShared handler" });
    return;
  }
};
