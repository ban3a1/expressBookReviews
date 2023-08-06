const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (users.some((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    const newUser = { username, password };
    users.push(newUser);
  
    return res.status(200).json({ message: "User registered successfully.", user: newUser });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.send(book)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
  const matchedBooks = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      matchedBooks.push(books[isbn]);
    }
  }

  res.send(matchedBooks);

})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchedBooks = [];
  
    for (const isbn in books) {
      if (books[isbn].title === title) {
        matchedBooks.push(books[isbn]);
      }
    }
  
    res.send(matchedBooks);  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.send(book.reviews)
});

module.exports.general = public_users;
