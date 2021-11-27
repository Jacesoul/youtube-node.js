import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String, // { type: String }과 같은 의미이다.
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
