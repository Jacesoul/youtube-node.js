import express from "express";
import {
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getEdit,
  postEdit,
} from "../controllers/userController";
import { privateOnlyMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", privateOnlyMiddleware, logout);
userRouter
  .route("/edit")
  .all(privateOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin); // 해당 URL은 Github 사이트에서 설정가능
userRouter.get("/:id", see);

export default userRouter;
