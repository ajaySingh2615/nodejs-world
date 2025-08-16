import express from "express";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  deleteAuthor,
} from "../controllers/author.controller.js";

const router = express.Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);
router.delete("/:id", deleteAuthor);

export default router;
