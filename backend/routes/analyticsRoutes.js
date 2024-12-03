import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
const router = express.Router();
const analyticsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
// Analytics Dashboard Route
router.get('/dashboard', protect, admin, analyticsLimiter, getAnalytics);

export default router;
