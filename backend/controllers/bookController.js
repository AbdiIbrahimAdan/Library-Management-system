

import Book from '../models/Book.js';

// Create a new book
export const addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json({ message: 'Book created successfully!', book: savedBook });
  } catch (error) {
    res.status(400).json({ message: 'Error creating book', error: error.message });
  }
};

// Get all books
export const getAllBooks = async (req, res) => {
    try {
      const books = await Book.find(); // Fetch all books
      const count = books.length; // Calculate the total number of books
      res.status(200).json({ books, count }); // Return both books and the count
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
  };
  
// Get a single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

// Update a book by ID
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error: error.message });
  }
};

// Delete a book by ID
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

// Search for books by title or author
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error searching books', error: error.message });
  }
};

