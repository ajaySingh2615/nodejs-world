/**
 * Express Book Management API
 *
 * This is a simple REST API for managing books with in-memory storage.
 * It provides CRUD operations for books including create, read, and delete.
 *
 * Features:
 * - GET /books - Retrieve all books
 * - GET /books/:id - Retrieve a specific book by ID
 * - POST /books - Create a new book
 * - DELETE /books/:id - Delete a book by ID
 */

import express from "express";
import fs from "node:fs";

// Initialize Express application
const app = express();
const port = 8000;

// ============================================================================
// IN-MEMORY DATABASE (Temporary storage - data will be lost on server restart)
// ============================================================================
const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" },
];

function loggerMiddleware(req, res, next) {
  const log = `[${Date.now()}] ${req.method} ${req.path}`;
  fs.appendFileSync("logs.txt", log + "\n", "utf-8");
  next();
}

function customMiddleware(req, res, next) {
  console.log("I am custom middleware");
  next();
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================
// Parse incoming JSON payloads in request body
app.use(express.json());
app.use(loggerMiddleware);

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

/**
 * GET /books
 * Retrieves all books from the database
 *
 * @route GET /books
 * @returns {Array} Array of all books
 */
app.get("/books", (req, res) => {
  res.json(books);
});

/**
 * GET /books/:id
 * Retrieves a specific book by its ID
 *
 * @route GET /books/:id
 * @param {string} id - Book ID from URL parameters
 * @returns {Object} Book object if found
 * @returns {Object} Error message if ID is invalid or book not found
 */
app.get("/books/:id", customMiddleware, loggerMiddleware, (req, res) => {
  const id = parseInt(req.params.id);

  // Validate that the ID parameter is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid book id" });
  }

  // Find the book with the specified ID
  const book = books.find((book) => book.id === id);

  // Return 404 if book is not found
  if (!book) {
    return res.status(404).json({ message: `Book with id ${id} not found` });
  }

  return res.json(book);
});

/**
 * POST /books
 * Creates a new book in the database
 *
 * @route POST /books
 * @body {string} title - Book title (required)
 * @body {string} author - Book author (required)
 * @returns {Object} Success message and new book ID
 * @returns {Object} Error message if validation fails
 */
app.post("/books", (req, res) => {
  const { title, author } = req.body;

  // Validate that title is provided and not empty
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  // Validate that author is provided and not empty
  if (!author || author.trim() === "") {
    return res.status(400).json({ error: "Author is required" });
  }

  // Generate a new unique ID (simple increment strategy)
  // Note: In production, you'd want a more robust ID generation system
  const id =
    books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

  // Create new book object
  const newBook = { id, title, author };

  // Add book to the database
  books.push(newBook);

  return res.status(201).json({
    message: "Book created successfully",
    id,
    book: newBook,
  });
});

/**
 * DELETE /books/:id
 * Deletes a book from the database by its ID
 *
 * @route DELETE /books/:id
 * @param {string} id - Book ID from URL parameters
 * @returns {Object} Success message if book is deleted
 * @returns {Object} Error message if ID is invalid or book not found
 */
app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Validate that the ID parameter is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: "id must be a number" });
  }

  // Find the index of the book to delete
  const indexToDelete = books.findIndex((book) => book.id === id);

  // Return 404 if book is not found
  if (indexToDelete < 0) {
    return res
      .status(404)
      .json({ message: `Book with id ${id} does not exist` });
  }

  // Remove the book from the array
  books.splice(indexToDelete, 1);

  return res.status(200).json({ message: "Book deleted successfully" });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Book API endpoints available at http://localhost:${port}/books`);
});
