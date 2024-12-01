// import Book from '../models/Book.js';
// import { cloudinary } from '../utils/cloudinaryConfig.js'; // Import Cloudinary config

// // Add book with image upload
// export const addBook = async (req, res) => {
//     console.log(req.file); // Log the file object
//     console.log("req.body:", req.body);
//     if (!req.file) {
//         return res.status(400).json({ message: 'No image uploaded' });
//     }

//     try {
//         const {
//             title,
//             author,
//             description,
//             ISBN,
//             category,
//             price,
//             stock,
//             availableCopies,
//             totalCopies,
//             publishedDate,
//         } = req.body;

//         // Upload image to Cloudinary
//         const imageUploadResponse = await cloudinary.v2.uploader.upload(req.file.path, {
//             folder: 'library_images',
//             allowed_formats: ['jpg', 'jpeg', 'png'],
//         });
        
//         const newBook = new Book({
//             title,
//             author,
//             description,
//             ISBN,
//             category,
//             price,
//             stock,
//             availableCopies,
//             totalCopies,
//             publishedDate,
//             imageUrl: imageUploadResponse.secure_url, // Get the secure URL from Cloudinary
//         });

//         await newBook.save();
//         res.status(201).json(newBook);
//     } catch (error) {
//         console.error('Error adding book:', error);
//         res.status(500).json({ message: 'Error adding book', error: error.message });
//     }
// };

// // Get all books
// export const getAllBooks = async (req, res) => {
//     try {
//         const books = await Book.find();
//         res.status(200).json(books);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching books', error: error.message });
//     }
// };
// // Add rating and comment
// export const addRatingAndComment = async (req, res) => {
//     try {
//         const { bookId } = req.params;
//         const { userId, rating, comment } = req.body;

//         const book = await Book.findById(bookId);
//         if (!book) {
//             return res.status(404).json({ message: 'Book not found' });
//         }

//         // Add rating and comment
//         book.comments.push({ user: userId, rating, comment });
//         book.totalRatings += 1;
//         book.averageRating = (book.averageRating * (book.totalRatings - 1) + rating) / book.totalRatings;

//         await book.save();
//         res.status(200).json(book);
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding rating and comment', error: error.message });
//     }
// };

// // Search books (basic implementation)
// export const searchBooks = async (req, res) => {
//     try {
//         const { query } = req.query; // Get search query from request
//         const books = await Book.find({
//             $or: [
//                 { title: { $regex: query, $options: 'i' } },
//                 { author: { $regex: query, $options: 'i' } },
//                 { description: { $regex: query, $options: 'i' } },
//             ],
//         });
//         res.status(200).json(books);
//     } catch (error) {
//         res.status(500).json({ message: 'Error searching books', error: error.message });
//     }
// };

// // Get recommendations (basic implementation)
// export const getRecommendations = async (req, res) => {
//     try {
//         const books = await Book.find().limit(5); // Example: Get 5 random books
//         res.status(200).json(books);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
//     }
// };

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

