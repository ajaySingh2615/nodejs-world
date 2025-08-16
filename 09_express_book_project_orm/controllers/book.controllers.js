import { booksTable } from "../models/book.models.js";
import db from "../db/index.js";
import { eq, sql } from "drizzle-orm";

async function getAllBooks(req, res) {
  const search = req.query.search;
  if (search) {
    const books = await db
      .select()
      .from(booksTable)
      .where(
        sql`to_tsvector('english', ${booksTable.title}) @@ to_tsquery('english', ${search})`
      );
    return res.json(books);
  }
  const books = await db.select().from(booksTable);
  return res.json(books);
}

async function getBookById(req, res) {
  const id = req.params.id;

  // Find the book with the specified ID
  const [book] = await db
    .select()
    .from(booksTable)
    .where((table) => eq(table.id, id))
    .limit(1);

  // Return 404 if book is not found
  if (!book) {
    return res.status(404).json({ message: `Book with id ${id} not found` });
  }

  return res.json(book);
}

async function createBook(req, res) {
  const { title, description, authorId } = req.body;

  // Validate that title is provided and not empty
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const [result] = await db
    .insert(booksTable)
    .values({ title, description, authorId })
    .returning({ id: booksTable.id });

  return res.status(201).json({
    message: "Book created successfully",
    id: result.id,
  });
}

async function deleteBook(req, res) {
  const id = req.params.id;

  await db.delete(booksTable).where(eq(booksTable.id, id));

  return res.status(200).json({ message: "Book deleted successfully" });
}

export { getAllBooks, getBookById, createBook, deleteBook };
