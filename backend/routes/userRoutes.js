import express from 'express';
import { getAllUsers, getUserById, updateUserRole, deleteUser } from '../controllers/userController.js';
// import { fetchUserAnalytics } from '../controllers/analysisController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
// import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for analytics
// const analyticsLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });

// Protected routes
router.get('/', protect, admin, getAllUsers);
// router.get('/analytics', protect, admin, analyticsLimiter, fetchUserAnalytics);
router.get('/:id', protect, getUserById);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;