import { Router } from "express";
import { StoryController } from "../controllers/story.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

export default function storyRoutes(storyController: StoryController): Router {
  const router = Router();

  router.get("/", storyController.getStories.bind(storyController));
  router.post("/", verifyAuth, storyController.createStory.bind(storyController));
  router.delete("/:id", verifyAuth, storyController.deleteStory.bind(storyController));

  return router;
}
