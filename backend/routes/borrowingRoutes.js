import express from 'express';
import { borrowBook } from '../controllers/borrowingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Borrow book route
router.post('/', borrowBook);

export default router;