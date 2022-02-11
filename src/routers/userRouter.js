import express from "express";

import {
  getEdit,
  postEdit,
  remove,
  startGithubLogin,
  finishGithubLogin,
  logout,
  getChangePassword,
  postChangePassword,
  see,
} from "../controllers/userController";
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);

userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);

userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

userRouter.get("/remove", remove);

userRouter.get("/:id", see);

export default userRouter;
