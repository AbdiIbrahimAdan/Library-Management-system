// import mongoose from 'mongoose';

// const commentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   comment: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const bookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   author: { type: String, required: true },
//   description: { type: String },
//   ISBN: { type: String, unique: true, required: true },
//   category: { 
//     type: String,
//     required: true,
//     enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Children', 'Other']
//   },
//   price: { type: Number },
//   stock: { type: Number, default: 1 },
//   availableCopies: { type: Number, default: 1 },
//   totalCopies: { type: Number, default: 1 },
//   publishedDate: { type: Date },
//   imageUrl: { type: String }, // Keep this for image uploads
//   comments: [commentSchema],
//   averageRating: {
//     type: Number,
//     default: 0
//   },
//   totalRatings: {
//     type: Number,
//     default: 0
//   },
//   borrowCount: {
//     type: Number,
//     default: 0
//   },
//   keywords: [String], // For better search functionality
//   language: String,
//   publisher: String,
//   pages: Number,
//   tags: [String] // New field for tags
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtual for book availability status
// bookSchema.virtual('status').get(function() {
//   return this.availableCopies > 0 ? 'Available' : 'Not Available';
// });

// // Index for search functionality
// bookSchema.index({ 
//   title: 'text', 
//   author: 'text', 
//   description: 'text',
//   keywords: 'text'
// });

// const Book = mongoose.model('Book', bookSchema);

// export default Book;


import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  ISBN: { type: String, unique: true, required: true },
  category: { type: String },
  price: { type: Number },
  stock: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 }, // Tracks copies available for borrowing
  totalCopies: { type: Number, default: 1 },    // Total copies in inventory
  publishedDate: { type: Date },               // Date of publication
  imageUrl: { type: String },                  // URL for book cover image
}, { 
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
