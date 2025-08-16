import { authorsTable } from "../models/author.models.js";
import { booksTable } from "../models/book.models.js";
import db from "../db/index.js";
import { eq } from "drizzle-orm";

async function getAllAuthors(req, res) {
  const authors = await db.select().from(authorsTable);
  return res.json(authors);
}

async function getAuthorById(req, res) {
  const id = req.params.id;
  const [author] = await db
    .select()
    .from(authorsTable)
    .where(eq(authorsTable.id, id));

  if (!author) {
    return res.status(404).json({ message: `Author with id ${id} not found` });
  }

  return res.json(author);
}

async function createAuthor(req, res) {
  const { firstName, lastName, email } = req.body;
  const [result] = await db
    .insert(authorsTable)
    .values({ firstName, lastName, email })
    .returning({ id: authorsTable.id });

  return res.status(201).json({
    message: "Author created successfully",
    id: result.id,
  });
}

async function deleteAuthor(req, res) {
  const id = req.params.id;
  await db.delete(authorsTable).where(eq(authorsTable.id, id));
  return res.json({ message: `Author with id ${id} deleted successfully` });
}

async function getAuthorBooks(req, res) {
  const books = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.authorId, req.params.id));
  return res.json(books);
}

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  deleteAuthor,
  getAuthorBooks,
};
