const express = require("express");
const axios = require("axios");
let books = require("../config/booksdb.js");
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

// Get the book list available in the shop (Task 10)
public_users.get("/", async (req, res) => {
    try {
        // Using async-await
        const getBooks = async () => books;
        const bookList = await getBooks();
        return res.status(200).json({ books: bookList });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching books" });
    }
});

// Get the book list using Promises
public_users.get("/promises", (req, res) => {
    const getBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }
    });

    getBooks
        .then((bookList) => res.status(200).json({ books: bookList }))
        .catch((err) => res.status(500).json({ message: err }));
});

// Get book details based on ISBN (Task 11)
public_users.get("/isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;

    try {
        const getBookByISBN = async (isbn) => books[isbn];
        const book = await getBookByISBN(isbn);
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching the book" });
    }
});

// Get book details by ISBN using Promises
public_users.get("/promises/isbn/:isbn", (req, res) => {
    const { isbn } = req.params;

    const getBookByISBN = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on Author (Task 12)
public_users.get("/author/:author", async (req, res) => {
    const { author } = req.params;

    try {
        const getBooksByAuthor = async (author) =>
            Object.entries(books)
                .filter(([isbn, book]) => book.author.toLowerCase() === author.toLowerCase())
                .map(([isbn, book]) => ({ isbn, ...book }));

        const results = await getBooksByAuthor(author);
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(404).json({ message: "No books found for the given author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching the books" });
    }
});

// Get books by Author using Promises
public_users.get("/promises/author/:author", (req, res) => {
    const { author } = req.params;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        const results = Object.entries(books)
            .filter(([isbn, book]) => book.author.toLowerCase() === author.toLowerCase())
            .map(([isbn, book]) => ({ isbn, ...book }));

        if (results.length > 0) {
            resolve(results);
        } else {
            reject("No books found for the given author");
        }
    });

    getBooksByAuthor
        .then((results) => res.status(200).json(results))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on Title (Task 13)
public_users.get("/title/:title", async (req, res) => {
    const { title } = req.params;

    try {
        const getBooksByTitle = async (title) =>
            Object.entries(books)
                .filter(([isbn, book]) => book.title.toLowerCase().includes(title.toLowerCase()))
                .map(([isbn, book]) => ({ isbn, ...book }));

        const results = await getBooksByTitle(title);
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(404).json({ message: "No books found with the given title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching the books" });
    }
});

// Get books by Title using Promises
public_users.get("/promises/title/:title", (req, res) => {
    const { title } = req.params;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const results = Object.entries(books)
            .filter(([isbn, book]) => book.title.toLowerCase().includes(title.toLowerCase()))
            .map(([isbn, book]) => ({ isbn, ...book }));

        if (results.length > 0) {
            resolve(results);
        } else {
            reject("No books found with the given title");
        }
    });

    getBooksByTitle
        .then((results) => res.status(200).json(results))
        .catch((err) => res.status(404).json({ message: err }));
});

module.exports = { public_users };
