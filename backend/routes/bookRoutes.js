
// import express from 'express';
// import { addBook, getAllBooks, searchBooks, getRecommendations, addRatingAndComment } from '../controllers/bookController.js';
// import { upload } from '../utils/cloudinaryConfig.js';

// const router = express.Router();

// // Add book route
// router.post('/add', upload.single('image'), addBook); // Image upload
//  // Book file upload
// router.get('/', getAllBooks )
// router.get('/search', searchBooks); // Search books
// router.get('/recommendations', getRecommendations); // Get recommendations
// router.post('/:bookId/rate', addRatingAndComment); // Add rating and comment

// export default router;


import express from 'express';
import { addBook, getAllBooks } from '../controllers/bookController.js';
import { upload } from '../utils/cloudinaryConfig.js';

const router = express.Router();

// Add a new book with Cloudinary image upload
router.post('/add', upload.single('image'), addBook);

// Get all books
router.get('/', getAllBooks);

export default router;
