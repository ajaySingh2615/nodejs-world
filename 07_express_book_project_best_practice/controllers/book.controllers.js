import { BOOKS } from "../db/book.js";

function getAllBooks(req, res) {
  res.json(BOOKS);
}

function getBookById(req, res) {
  const id = parseInt(req.params.id);

  // Validate that the ID parameter is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid book id" });
  }

  // Find the book with the specified ID
  const book = BOOKS.find((book) => book.id === id);

  // Return 404 if book is not found
  if (!book) {
    return res.status(404).json({ message: `Book with id ${id} not found` });
  }

  return res.json(book);
}

function createBook(req, res) {
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
    BOOKS.length > 0 ? Math.max(...BOOKS.map((book) => book.id)) + 1 : 1;

  // Create new book object
  const newBook = { id, title, author };

  // Add book to the database
  BOOKS.push(newBook);

  return res.status(201).json({
    message: "Book created successfully",
    id,
    book: newBook,
  });
}

function deleteBook(req, res) {
  const id = parseInt(req.params.id);

  // Validate that the ID parameter is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ message: "id must be a number" });
  }

  // Find the index of the book to delete
  const indexToDelete = BOOKS.findIndex((book) => book.id === id);

  // Return 404 if book is not found
  if (indexToDelete < 0) {
    return res
      .status(404)
      .json({ message: `Book with id ${id} does not exist` });
  }

  // Remove the book from the array
  BOOKS.splice(indexToDelete, 1);

  return res.status(200).json({ message: "Book deleted successfully" });
}

export { getAllBooks, getBookById, createBook, deleteBook };
