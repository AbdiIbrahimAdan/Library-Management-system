import Borrowing from '../models/Borrowing.js';
import Book from '../models/Book.js';

export const borrowBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!bookId || !dueDate) {
      return res.status(400).json({ message: 'Book ID and due date are required.' });
    }

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available for borrowing.' });
    }

    // Check for existing borrow record
    const existingBorrowing = await Borrowing.findOne({
      user: userId,
      book: bookId,
      status: { $in: ['Pending', 'Borrowed'] },
    });

    if (existingBorrowing) {
      return res.status(400).json({ message: 'You already have this book borrowed or pending.' });
    }

    const borrowing = new Borrowing({
      user: userId,
      book: bookId,
      dueDate,
    });

    await borrowing.save();
    book.availableCopies -= 1;
    book.borrowCount += 1;
    await book.save();

    res.status(201).json({ success: true, message: 'Book borrowed successfully.', borrowing });
  } catch (error) {
    res.status(500).json({ message: 'Error borrowing book.', error: error.message });
  }
};
