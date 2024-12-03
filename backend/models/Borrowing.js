import mongoose from 'mongoose';

const borrowingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Borrowed', 'Returned', 'Overdue'], default: 'Pending' },
  fine: { type: Number, default: 0 },
}, { timestamps: true });

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

export default Borrowing;
