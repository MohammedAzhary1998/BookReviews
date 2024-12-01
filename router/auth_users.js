const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {
    "user1":{"password":"pass1"},
    "user2":{"password":"pass2"}
};

const secretKey = "Netskdlkfgdkngkbgnl;dngdfncvlhmlkmndfgfdjkngfdj"; 

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Function to check if username and password match the records
const authenticatedUser = (username, password) => {
    if (users[username] && users[username].password === password) {
      return true; // Return true if the credentials match
    }
    return false; // Return false otherwise
  };
  
  // Login endpoint
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; 
  
    // Validate that both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the user is authenticated
    if (authenticatedUser(username, password)) {
      // Generate a JWT for the session
      const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
  
      return res.status(200).json({ message: "Login successful", token });
    } else {
      // If authentication fails, return a 401 response
      return res.status(401).json({ message: "Invalid username or password" });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;