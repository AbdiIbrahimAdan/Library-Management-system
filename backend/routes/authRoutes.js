
import express from 'express';
import { register, login } from '../controllers/authController.js';
// import { getAllUsers, deleteUser } from '../controllers/userController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router(); 


router.post('/register', register);

router.post('/login', login);
// router.get('/', protect, admin, getAllUsers); 
// router.delete('/:id', protect, admin, deleteUser);

export default router; 