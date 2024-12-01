import Borrowing from '../models/Borrowing.js';
import Book from '../models/Book.js';

export const borrowBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available for borrowing' });
    }

    const borrowing = new Borrowing({
      user: userId,
      book: bookId,
      dueDate,
    });

    await borrowing.save();

    // Update book availability
    book.availableCopies -= 1;
    book.borrowCount += 1;
    await book.save();

    res.status(201).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: 'Error borrowing book', error: error.message });
  }
};