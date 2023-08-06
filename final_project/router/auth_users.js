const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Find the user in the 'users' array based on the provided username
    const user = users.find((user) => user.username === username);
  
    // If the user is not found or the password is incorrect, return an error
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    // If the username and password are correct, create a JWT with the user's information
    const secretKey = "yourSecretKey"; // Replace this with your secret key used for JWT signing
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: "1h" });
  
    // Return the JWT in the response
    return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const token = req.headers.authorization;
  
    // Check if the user is authenticated by validating the JWT token
    const secretKey = "yourSecretKey"; // Replace this with your actual secret key used for JWT signing

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }
  
      // Get the username from the decoded JWT token
      const username = decoded.username;
  
      // Find the book in the 'books' array based on the provided ISBN
      const book = books.find((book) => book.isbn === isbn);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
  
      // Check if the user already posted a review for this ISBN
      const existingReview = book.reviews.find((rev) => rev.username === username);
  
      // If the user has already posted a review, update the existing review
      if (existingReview) {
        existingReview.review = review;
        return res.status(200).json({ message: "Review updated successfully.", review: existingReview });
      }
  
      // If the user has not posted a review for this ISBN, add a new review
      const newReview = { username, review };
      book.reviews.push(newReview);
  
    });
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
