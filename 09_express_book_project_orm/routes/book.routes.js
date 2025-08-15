import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
} from "../controllers/book.controllers.js";

const router = express.Router();

router.get("/", getAllBooks);

router.get("/:id", getBookById);

router.post("/", createBook);

router.delete("/:id", deleteBook);

export default router;
