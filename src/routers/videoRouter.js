import express from "express";
import { watch, edit, deleteVideo, search, upload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);
videoRouter.get("/delete", deleteVideo);
videoRouter.get("/search", search);
videoRouter.get("/upload", upload);

export default videoRouter;
