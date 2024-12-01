const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from the request body
  console.log("Registered Users: ", users);

  // Validate that both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the user
  users[username] = { password }; // Save username and password (hash passwords in production)
  console.log("Registered Users After Added: ", users);
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const results = [];

  // Iterate through the books to find matches
  for (const [isbn, book] of Object.entries(books)) {
    if (book.author.toLowerCase() === author.toLowerCase()) {
      results.push({ isbn, ...book });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res
      .status(404)
      .json({ message: "No books found for the given author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const results = [];

  // Iterate through the books to find matches
  for (const [isbn, book] of Object.entries(books)) {
    if (book.title.toLowerCase().includes(title.toLowerCase())) {
      results.push({ isbn, ...book });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res
      .status(404)
      .json({ message: "No books found with the given title" });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Find the book by its ISBN in the books object

  if (book) {
    // Return the reviews for the book if it exists
    return res.status(200).json({ reviews: book.reviews });
  } else {
    // If the book is not found, return a 404 response
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
