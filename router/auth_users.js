const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticateToken, secretKey } = require("./auth_middleware");
let books = require("../config/booksdb.js");
let users = require("../config/usersdb.js");

const regd_users = express.Router();

const isValid = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

const authenticatedUser = (username, password) =>
  users[username]?.password === password;

// Login endpoint
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
  const username = req.user.username;
  const { isbn } = req.params;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;
  return res
    .status(200)
    .json({
      message: "Review added/updated successfully",
      reviews: book.reviews,
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
  const username = req.user.username;
  const { isbn } = req.params;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for the user" });
  }

  delete book.reviews[username];

  return res
    .status(200)
    .json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports = { regd_users, isValid, users };
