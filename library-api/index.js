const express = require("express");
const app = express();
const PORT = 3000;

// Sample data for the library
let books = [
  { id: 1, title: "1984", author: "George Orwell", availableCopies: 3 },
  {
    id: 2,
    title: "Brave New World",
    author: "Aldous Huxley",
    availableCopies: 5,
  },
  {
    id: 3,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    availableCopies: 4,
  },
  {
    id: 4,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    availableCopies: 2,
  },
  {
    id: 5,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    availableCopies: 6,
  },
];

let users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    borrowedBooks: [2, 4, 5],
  },
  { id: 2, name: "Bob", email: "bob@example.com", borrowedBooks: [1, 3] },
  { id: 3, name: "Charlie", email: "charlie@example.com", borrowedBooks: [1] },
  {
    id: 4,
    name: "Dave",
    email: "dave@example.com",
    borrowedBooks: [2, 3, 4, 5],
  },
  { id: 5, name: "Eve", email: "eve@example.com", borrowedBooks: [4] },
];

// Middleware to parse JSON request bodies
app.use(express.json());

// GET /books
// Returns all books in the library. Optionally, can filter by author using a query parameter.
app.get("/books", (request, response) => {
  const query = request.query;
  let filteredBooks = books;
  if (query.author) {
    filteredBooks = books.filter((book) => book.author === query.author);
  }
  response.json(filteredBooks);
});

// POST /books
// Adds a new book to the library. Expects title, author, and availableCopies in the request body.
app.post("/books", (request, response) => {
  const requestBody = request.body;
  if (
    !requestBody.title ||
    !requestBody.author ||
    !requestBody.availableCopies
  ) {
    return response
      .status(400)
      .json({ message: "Please provide title, author, and availableCopies" });
  }

  const newBook = {
    id: books.length + 1,
    title: requestBody.title,
    author: requestBody.author,
    availableCopies: requestBody.availableCopies,
  };
  books.push(newBook);
  return response.status(201).json(newBook);
});

// GET /books/:id
// Returns a specific book by its ID.
app.get("/books/:id", (request, response) => {
  let bookId = parseInt(request.params.id);
  if (isNaN(bookId)) {
    return response
      .status(400)
      .json({ message: "Please provide a valid book ID integer vallue" });
  }

  if (!book) {
    return response
      .status(404)
      .json({ message: `Book with id: ${bookId} was not found` });
  }

  return response.status(200).json(book);
});

// PUT /books/:id
// Updates a book's details by its ID. Expects title, author, and availableCopies in the request body.
app.put("/books/:id", (request, response) => {
  const bookId = parseInt(request.params.id);

  if (isNaN(bookId)) {
    return response
      .status(400)
      .json({ message: "Please provide a valid book ID integer value" });
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return response
      .status(404)
      .json({ message: `Book with id: ${bookId} was not found` });
  }

  const requestBody = request.body;
  if (
    !requestBody.title ||
    !requestBody.author ||
    !requestBody.availableCopies
  ) {
    return response
      .status(400)
      .json({ message: "Please provide title, author, and availableCopies" });
  }

  books[bookIndex] = {
    id: bookId,
    title: requestBody.title,
    author: requestBody.author,
    availableCopies: requestBody.availableCopies,
  };

  return response.status(200).json(books[bookIndex]);
});

// DELETE /books/:id
// Deletes a book by its ID.
app.delete("/books/:id", (request, response) => {
  const bookId = parseInt(request.params.id);

  if (isNaN(bookId)) {
    return response
      .status(400)
      .json({ message: "Please provide a valid book ID integer value" });
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return response
      .status(404)
      .json({ message: `Book with id: ${bookId} was not found` });
  }

  books.splice(bookIndex, 1);
  return response.json({ message: "Book deleted successfully" });
});

// GET /users/:userId/books
// Gets all books the specified user has checked out
app.get("/users/:userId/books", (request, response) => {
  const userId = parseInt(request.params.userId);
  if (isNaN(userId)) {
    return response
      .status(400)
      .json({ message: "Please provide a valid user ID integer value" });
  }

  const user = users.find((user) => user.id === userId);
  if (!user) {
    return response
      .status(404)
      .json({ message: `User with id: ${userId} does not exist` });
  }

  const borrowedBookDetails = [];
  user.borrowedBooks.forEach((bookId) => {
    borrowedBookDetails.push(books.find((book) => book.id === bookId));
  });

  return response.json(borrowedBookDetails);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
