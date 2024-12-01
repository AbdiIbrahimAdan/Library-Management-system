import Cart from '../models/Cart.js';
import Book from '../models/Book.js';

export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ book: bookId, quantity });
    }

    cart.totalAmount = cart.items.reduce((total, item) => total + (item.quantity * book.price), 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};