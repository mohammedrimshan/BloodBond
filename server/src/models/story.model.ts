import mongoose, { Document, Schema, Types } from "mongoose";

export interface IStory extends Document {
  author: Types.ObjectId;
  authorName: string;
  authorPhoto?: string;
  content: string;
  image?: string;
  isApproved: boolean;
  createdAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorPhoto: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const StoryModel = mongoose.model<IStory>("Story", storySchema);
