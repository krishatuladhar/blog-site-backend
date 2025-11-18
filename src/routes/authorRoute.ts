import express from "express";
import {
  createAuthor,
  updateAuthor,
  getAuthor,
  deleteAuthor,
} from "../controllers/authorController";
import { upload } from "../middlewares/upload";

const authorRouter = express.Router();
authorRouter.post("/", upload.single("profile"), createAuthor);
authorRouter.get("/:id", getAuthor);
authorRouter.delete("/:id", deleteAuthor);
authorRouter.put("/:id", upload.single("profile"), updateAuthor);

export default authorRouter;
