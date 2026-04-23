import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StoryService } from "../services/story.service";
import { StatusCode } from "../constants/statusCode";

export class StoryController {
  constructor(private storyService: StoryService) {}

  createStory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { content, image, authorName, authorPhoto } = req.body;
    const story = await this.storyService.createStory(userId, { content, image, authorName, authorPhoto });
    res.status(StatusCode.CREATED).json({ success: true, story });
  });

  getStories = asyncHandler(async (req: Request, res: Response) => {
    const stories = await this.storyService.getAllStories();
    res.status(StatusCode.OK).json({ success: true, stories });
  });

  deleteStory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const isAdmin = (req as any).user.role === "admin";
    await this.storyService.deleteStory(id, userId, isAdmin);
    res.status(StatusCode.OK).json({ success: true, message: "Story deleted" });
  });
}
