import express from 'express';
import { addToCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Add to cart route
router.post('/', addToCart);

export default router;