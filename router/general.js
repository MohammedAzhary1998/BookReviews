const express = require("express");
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users");

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list
public_users.get("/", (req, res) => res.status(200).json({ books }));

// Get book details by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    return book
        ? res.status(200).json(book)
        : res.status(404).json({ message: "Book not found" });
});

// Get book details by author
public_users.get("/author/:author", (req, res) => {
    const results = Object.entries(books)
        .filter(([isbn, book]) => book.author.toLowerCase() === req.params.author.toLowerCase())
        .map(([isbn, book]) => ({ isbn, ...book }));

    return results.length > 0
        ? res.status(200).json(results)
        : res.status(404).json({ message: "No books found for the given author" });
});

// Get book details by title
public_users.get("/title/:title", (req, res) => {
    const results = Object.entries(books)
        .filter(([isbn, book]) => book.title.toLowerCase().includes(req.params.title.toLowerCase()))
        .map(([isbn, book]) => ({ isbn, ...book }));

    return results.length > 0
        ? res.status(200).json(results)
        : res.status(404).json({ message: "No books found with the given title" });
});

// Get book reviews
public_users.get("/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    return book
        ? res.status(200).json({ reviews: book.reviews })
        : res.status(404).json({ message: "Book not found" });
});

module.exports = { public_users };
