import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  ISBN: { type: String, unique: true, required: true },
  category: { type: String, required: true, enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Story', 'History', 'Others'] },
  price: { type: Number, required: true },
  stock: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  totalCopies: { type: Number, default: 1 },
  publishedDate: { type: Date },
  imageUrl: { type: String },
  borrowCount: { type: Number, default: 0 }, // Tracks borrowing popularity
  averageRating: { type: Number, default: 0 }, // New field for average rating
  totalRatings: { type: Number, default: 0 },  // New field for total ratings
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;