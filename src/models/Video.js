import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // { type: String }과 같은 의미이다.
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, // Date.now()를 하지 않은 이유는 바로 실행시키고 싶지 않아서이다. mongoose는 새로운 video를 생성했을 때만 실행시킨다.
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
