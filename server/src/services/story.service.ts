import { StoryModel, IStory } from "../models/story.model";
import { SocketService } from "./socket.service";
import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCode";

export class StoryService {
  constructor(private socketService: SocketService) {}

  async createStory(userId: string, data: { content: string; image?: string; authorName: string; authorPhoto?: string }) {
    const story = await StoryModel.create({
      author: userId,
      ...data,
      isApproved: true, // Auto-approve for now, or set to false if review needed
    });

    // Broadcast to all users in real-time
    this.socketService.broadcast("new_success_story", story);

    return story;
  }

  async getAllStories() {
    return await StoryModel.find({ isApproved: true }).sort({ createdAt: -1 });
  }

  async deleteStory(storyId: string, userId: string, isAdmin: boolean) {
    const story = await StoryModel.findById(storyId);
    if (!story) throw new AppError("Story not found", StatusCode.NOT_FOUND);

    if (!isAdmin && story.author.toString() !== userId) {
      throw new AppError("Not authorized to delete this story", StatusCode.FORBIDDEN);
    }

    await story.deleteOne();
    return { success: true };
  }
}
