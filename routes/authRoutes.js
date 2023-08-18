import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserbyId,
  loginUser,
  updateUser,
} from '../controller/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getAllUser);
router.get('/:id', authMiddleware, getUserbyId);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
